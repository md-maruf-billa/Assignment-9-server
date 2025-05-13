import bcrypt from 'bcrypt';
import { prisma } from '../../utils/Prisma';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../utils/JWT';
import configs from '../../configs';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { EmailSender } from '../../utils/emailSender';
import { AppError } from './../../utils/AppError';
import { Role } from '@prisma/client';
import { TChangeStatus } from './auth.interface';

const register_user_into_db = async (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  if (!payload.email || !payload.password) {
    throw new AppError(
      'Email and password are required',
      httpStatus.BAD_REQUEST,
    );
  }

  if (!payload.role) {
    throw new AppError('Role is required', httpStatus.BAD_REQUEST);
  }
  const isAccountExists = await prisma.account.findUnique({
    where: { email: payload.email },
  });

  if (isAccountExists) {
    throw new AppError('Account already exists', httpStatus.BAD_REQUEST);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(payload.email)) {
    throw new AppError('Invalid email format', httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const accountData = {
    email: payload.email,
    password: hashedPassword,
    role: payload.role.toUpperCase() as Role,
  };
  const result = await prisma.$transaction(async tx => {
    const createdAccount = await tx.account.create({ data: accountData });
    if (payload.role === 'COMPANY') {
      await tx.company.create({
        data: {
          accountId: createdAccount.id,
          name: payload.name,
        },
      });
    }

    if (payload.role === 'USER') {
      await tx.user.create({
        data: { accountId: createdAccount.id, name: payload.name },
      });
    }
    if (payload.role === 'ADMIN') {
      await tx.admin.create({
        data: { accountId: createdAccount.id, name: payload.name },
      });
    }
    const finalUser = await tx.account.findUnique({
      where: { email: payload.email },
      include: {
        company: true,
        user: true,
        admin: true,
      },
    });
    EmailSender(
      createdAccount.email,
      'Welcome to ReviewHub – Account Successfully Created',
      `
        <p>Hi there,</p>
    
        <p>Thank you for signing up! Your account has been successfully created and you're now ready to explore all that ReviewHub has to offer.</p>
      `,
    );

    return finalUser;
  });
  return result;
};

const login_user_from_db = async (payload: {
  email: string;
  password: string;
}) => {
  const isUserExists = await prisma.account.findUnique({
    where: { email: payload.email, status: 'ACTIVE', isDeleted: false },
    include: {
      company: true,
      user: true,
      admin: true,
    },
  });
  if (!isUserExists) {
    throw new AppError('Account not found', httpStatus.NOT_FOUND);
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExists.password,
  );

  if (!isPasswordMatch) {
    throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
  }

  const { password, ...userData } = isUserExists;

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    configs.jwt.access_secret as Secret,
    configs.jwt.access_expires as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    configs.jwt.refresh_secret as Secret,
    configs.jwt.refresh_expires as string,
  );
  EmailSender(
    isUserExists.email,
    'Successfully login !!!',
    `<p>You are successfully login your account. If this wasn't you, please 
        <a href="${configs.jwt.reset_base_link}" style="color: #1a73e8;">reset your password</a> immediately.
    </p>`,
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const get_my_profile_from_db = async (email: string) => {
  const user = await prisma.account.findUnique({
    where: { email: email, isDeleted: false, status: 'ACTIVE' },
    select: {
      id: true,
      status: true,
      email: true,
      role: true,
      isPremium: true,
      isCompleteProfile: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          id: true,
          account: true,
          accountId: true,
          bio: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          isDeleted: true
        },
      },
      admin: {
        select: {
          name: true,
          id: true,
          account: true,
          accountId: true,
          bio: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          isDeleted: true
        },
      },
      company: {
        select: {
          name: true,
          _count: true,
          account: true,
          accountId: true,
          companyImage: true,
          createdAt: true,
          description: true,
          id: true,
          isDeleted: true,
          // products:true,
          website: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  // Add `name` field dynamically
  let name = null;

  if (user.admin?.name) {
    name = user.admin.name;
  } else if (user.user?.name) {
    name = user.user.name;
  } else if (user.company?.name) {
    name = user.company.name;
  }

  // Add the name to the returned object
  const result = {
    ...user,
    name,
  };

  return result;
};

const refresh_token_from_db = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new Error('You are not authorized!');
  }

  const userData = await prisma.account.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isDeleted: false,
      status: 'ACTIVE',
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    configs.jwt.access_secret as Secret,
    configs.jwt.access_expires as string,
  );

  return accessToken;
};

const change_password_from_db = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const today = new Date().toLocaleString();
  const isExistAccount = await prisma.account.findUnique({
    where: {
      email: user.email,
      isDeleted: false,
      status: 'ACTIVE',
    },
  });
  if (!isExistAccount) {
    throw new AppError('Account not found !', httpStatus.NOT_FOUND);
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isExistAccount.password,
  );

  if (!isCorrectPassword) {
    throw new AppError('Old password is incorrect', httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);

  await prisma.account.update({
    where: {
      email: isExistAccount.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  await EmailSender(
    isExistAccount.email,
    'Your Password Changed !!',
    `<div style="font-family: Arial, sans-serif;">
      <h4>Password Change Notification</h4>
      <p>Your password was changed on <strong>${today}</strong>.</p>
      <p>If this wasn't you, please 
        <a href="${configs.jwt.reset_base_link}" style="color: #1a73e8;">reset your password</a> immediately.
      </p>
    </div>`,
  );

  return 'Password update is successful.';
};

const forget_password_from_db = async (email: string) => {
  const isAccountExists = await prisma.account.findUnique({
    where: {
      email: email,
      isDeleted: false,
      status: 'ACTIVE',
    },
  });

  if (!isAccountExists) {
    throw new AppError('Account not found', 404);
  }

  const resetToken = jwtHelpers.generateToken(
    {
      email: isAccountExists.email,
      role: isAccountExists.role,
    },
    configs.jwt.reset_secret as Secret,
    configs.jwt.reset_expires as string,
  );

  const resetPasswordLink = `${configs.jwt.reset_base_link}?token=${resetToken}&email=${isAccountExists.email}`;
  const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

  await EmailSender(email, 'Reset Password Link', emailTemplate);

  return 'Reset password link sent to your email!';
};

const reset_password_into_db = async (
  token: string,
  email: string,
  newPassword: string,
) => {
  let decodedData: JwtPayload;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.reset_secret as Secret,
    );
  } catch (err) {
    throw new AppError(
      'Your reset link is expire. Submit new link request!!',
      httpStatus.UNAUTHORIZED,
    );
  }

  const isAccountExists = await prisma.account.findUnique({
    where: {
      email: decodedData.email,
      isDeleted: false,
      status: 'ACTIVE',
    },
  });
  if (!isAccountExists) {
    throw new AppError('Account not found!!', httpStatus.NOT_FOUND);
  }
  if (isAccountExists.email !== email) {
    throw new AppError('Invalid email', httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(newPassword, 10);

  await prisma.account.update({
    where: {
      email: isAccountExists.email,
    },
    data: {
      password: hashedPassword,
    },
  });
  EmailSender(
    isAccountExists.email,
    'Password Reset Successful.',
    `<p>Your password is successfully reset now you can login with using your password</p>`,
  );
  return 'Password reset successfully!';
};

const change_account_status_into_db = async (payload: TChangeStatus) => {
  const isAccountExist = await prisma.account.findUnique({
    where: {
      email: payload?.email,
    },
  });
  if (!isAccountExist) {
    throw new AppError('Account not found !!', httpStatus.NOT_FOUND);
  }
  // update new status
  const result = await prisma.account.update({
    where: {
      email: isAccountExist?.email,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

export const AuthService = {
  register_user_into_db,
  login_user_from_db,
  get_my_profile_from_db,
  refresh_token_from_db,
  change_password_from_db,
  forget_password_from_db,
  reset_password_into_db,
  change_account_status_into_db,
};
