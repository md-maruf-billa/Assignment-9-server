import { z } from 'zod';

const createReview = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rating: z.number().int().min(1).max(5),
  categoryId: z.string().uuid('Invalid category ID'),
  productId: z.string().uuid('Invalid product ID').optional(),
  purchaseSource: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  isPremium: z.boolean().optional(),
  accountId: z.string().uuid('Invalid account ID'),
  status: z.enum(['PENDING', 'APPROVED', 'UNPUBLISHED']).optional(),
  moderationNote: z.string().optional(),
});

const updateReview = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  productId: z.string().uuid('Invalid product ID').optional(),
  purchaseSource: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  isPremium: z.boolean().optional(),
  accountId: z.string().uuid('Invalid account ID').optional(),
  status: z.enum(['PENDING', 'APPROVED', 'UNPUBLISHED']).optional(),
  moderationNote: z.string().optional(),
});

export const reviewValidation = {
  createReview,
  updateReview,
};
