import { z } from 'zod';

const createCategory = z.object({
  name: z.string().min(1, { message: 'Category name is required' }),
});

const updateCategory = z.object({
  name: z.string().min(1, { message: 'Category name is required' }).optional(),
  categoryImage: z.string().optional(),
});

export const categoryValidation = {
  createCategory,
  updateCategory,
};
