import { z } from 'zod';

const createReview = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  rating: z.number().int().min(1).max(5),
  categoryId: z.string().uuid('Invalid category ID'),
  productId: z.string().uuid('Invalid product ID').optional(),
  purchaseSource: z.string().optional(),
  images: z
    .array(z.string().url(), { invalid_type_error: 'Must be an array of URLs' })
    .optional(),
  isPremium: z.boolean().optional(),
  userId: z.string().uuid('Invalid user ID'),
  purchaseSource: z.string().optional(),
  images: z.array(z.string().url()).optional(), // Optional array of image URLs
  isPremium: z.boolean().optional(),
  price: z.number().positive().optional(),
  authorId: z.string().uuid('Invalid author ID'),
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
  images: z.array(z.string().url()).optional(),
  isPremium: z.boolean().optional(),
  userId: z.string().uuid('Invalid user ID').optional(),
  purchaseSource: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  isPremium: z.boolean().optional(),
  price: z.number().positive().optional(),
  authorId: z.string().uuid('Invalid author ID').optional(),
  status: z.enum(['PENDING', 'APPROVED', 'UNPUBLISHED']).optional(),
  moderationNote: z.string().optional(),
});

export const reviewValidation = {
  createReview,
  updateReview,
};
