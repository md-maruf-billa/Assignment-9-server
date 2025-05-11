import { z } from 'zod';

const registerUser = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string(),
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
  email: z.string(),
});
const resetPassword = z.object({
  token: z.string(),
  newPassword: z.string(),
  email: z.string(),
});
const change_status = z.object({
  email: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
})

export const AuthValidation = {
  registerUser,
  loginUser,
  getMyProfile,
  forgotPassword,
  changePassword,
  resetPassword,
  change_status
};
