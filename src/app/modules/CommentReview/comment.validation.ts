import { z } from 'zod';

const createReviewCommentZodSchema = z.object({
  reviewId: z.string().uuid({ message: 'Invalid review ID format' }),
  accountId: z.string().uuid({ message: 'Invalid account ID format' }),
  content: z.string().min(1, { message: 'Content is required' }),
});

const updateReviewCommentZodSchema = z.object({
  content: z.string().min(1, { message: 'Content cannot be empty' }).optional(),
  isDeleted: z.boolean().optional(),
});

export const ReviewCommentValidation = {
  createReviewComment: createReviewCommentZodSchema,
  updateReviewComment: updateReviewCommentZodSchema,
};
