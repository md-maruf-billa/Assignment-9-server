import { Review } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import status from 'http-status';

const getReview = async () => {
  const result = await prisma.review.findMany();
  return result;
};
const getSingleReview = async (id: string) => {
  const result = await prisma.review.findUniqueOrThrow({
    where: { id: id },
  });
  return result;
};
const getReviewByUserId = async (id: string) => {
  const result = await prisma.review.findMany({
    where: { userId: id },
  });
  return result;
};
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
  getReview,
  getSingleReview,
  getReviewByUserId,
};
