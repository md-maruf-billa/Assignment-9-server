import { z } from 'zod';

const registerUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const getMyProfile = z.object({
  user: z.object({
    email: z.string().email(),
  }),
});

export const AuthValidation = {
  registerUser,
  loginUser,
  getMyProfile,
};
