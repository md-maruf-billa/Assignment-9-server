import { z } from "zod";

export const updateUser = z.object({
    name: z.string().optional(),
    profileImage: z.string().optional(),
    bio: z.string().optional(),
});

export const userValidation = {
    updateUser,
};