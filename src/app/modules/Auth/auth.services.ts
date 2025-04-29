import bcrypt from 'bcrypt';
import { prisma } from '../../utils/Prisma';
import { User } from '@prisma/client';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';

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
  console.log('Login payload:', payload);
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

export const AuthService = {
  registerUser,
  loginUser,
  getMyProfile,
};
