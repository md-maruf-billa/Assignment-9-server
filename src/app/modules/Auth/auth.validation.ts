import { z } from 'zod';

const registerUser = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const loginUser = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const getMyProfile = z.object({
  email: z.string().email(),
});

const changePassword = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const forgotPassword = z.object({
  email: z.string().email(),
});

export const AuthValidation = {
  registerUser,
  loginUser,
  getMyProfile,
  forgotPassword,
  changePassword,
};
