import bcrypt from 'bcrypt';
import { prisma } from '../../utils/Prisma';
import { User } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../utils/JWT';
import configs from '../../configs';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { EmailSender } from '../../utils/emailSender';

const registerUser = async (payload: Partial<User>) => {
  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required');
  }

  const isEmailExists = await prisma.user.findUnique({
    where: { email: payload.email, isDeleted: false },
  });

  if (isEmailExists) {
    throw new AppError('Email already exists', httpStatus.BAD_REQUEST);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    throw new AppError('Invalid email format', httpStatus.BAD_REQUEST);
  }
  if (payload.password.length < 6) {
    throw new AppError(
      'Password must be at least 6 characters long',
      httpStatus.BAD_REQUEST,
    );
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const UserData = {
    email: payload.email,
    password: hashedPassword,
    firstName: payload.firstName,
    lastName: payload.lastName,
  };

  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: UserData,
    });
    return user;
  });

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email, isDeleted: false },
  });
  if (!isUserExists) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
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

  const result = {
    user: userData,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  await prisma.user.update({
    where: { email: payload.email },
    data: { refreshToken: refreshToken },
  });

  return {
    user: userData,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const getMyProfile = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email, isDeleted: false },
  });

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  return user;
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new Error('You are not authorized!');
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      isDeleted: false,
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

  return {
    accessToken,
    refreshToken: userData.refreshToken,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError('Old password is incorrect', httpStatus.UNAUTHORIZED);
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: 'Password changed successfully!',
  };
};

const forgetPassword = async (email: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      isDeleted: false,
    },
  });

  if (!userData) {
    throw new AppError('User not found', 404);
  }

  const resetToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    configs.jwt.reset_secret as Secret,
    configs.jwt.reset_expires as string,
  );

  const resetPasswordLink = `${configs.jwt.reset_base_link}?token=${resetToken}&email=${userData.email}`;
  const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

  await EmailSender(email, 'Reset Password Link', emailTemplate);

  return {
    message: 'Reset password link sent to your email!',
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  getMyProfile,
};
