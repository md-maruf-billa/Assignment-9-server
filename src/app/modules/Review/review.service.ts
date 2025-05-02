import { Review } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import status from 'http-status';

const getReview = async () => {
  const result = await prisma.review.findMany({ where: { isDeleted: false } });
  return result;
};
const getSingleReview = async (id: string) => {
  const isExistReview = await prisma.review.findUnique({ where: { id, isDeleted: false } })
  if (!isExistReview) {
    throw new AppError("Review not found !!", status.NOT_FOUND)
  }
  return isExistReview;
};

const getReviewByUserId = async (id: string) => {
  const result = await prisma.review.findMany({
    where: { accountId: id, isDeleted: false },
  });
  if (!result) {
    throw new AppError("Review not found !!", status.NOT_FOUND)
  }
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
  if (!existing || existing.accountId !== userId) {
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

  if (existing?.accountId !== userId) {
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
