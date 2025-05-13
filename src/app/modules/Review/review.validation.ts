import { z } from 'zod';

const createReview = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rating: z.number().int().min(1).max(5),
  categoryId: z.string().uuid('Invalid category ID'),
  productId: z.string().uuid('Invalid product ID').optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  moderationNote: z.string().optional(),
});

const updateReview = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  productId: z.string().uuid('Invalid product ID').optional(),
  isPremium: z.boolean().optional(),
  status: z.enum(['PENDING', 'PUBLISHED', 'UNPUBLISHED']).optional(),
  moderationNote: z.string().optional(),
});

export const reviewValidation = {
  createReview,
  updateReview,
};
