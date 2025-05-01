import { Review } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import status from 'http-status';

const createReview = async (reviewData: Review) => {
  const result = await prisma.review.create({
    data: reviewData,
  });
  return result;
};
const updateReview = async (
  updatedData: Partial<Review>,
  reviewId: string,
  userId: string,
) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });
  if (!existing || existing.userId !== userId) {
    throw new AppError('Unauthorized or review not found', status.UNAUTHORIZED);
  }
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: updatedData,
  });
  return result;
};
const deleteReview = async (reviewId: string, userId: string) => {
  const existing = await prisma.review.findUniqueOrThrow({
    where: { id: reviewId, isDeleted: false },
  });

  if (existing?.userId !== userId) {
    throw new AppError(
      'Unauthorized to delete this review',
      status.UNAUTHORIZED,
    );
  }

  const result = await prisma.review.update({
    where: { id: reviewId },
    data: { isDeleted: true },
  });

  return result;
};

export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
};
