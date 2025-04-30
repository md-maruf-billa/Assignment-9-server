import { Review } from '@prisma/client';
import { prisma } from '../../utils/Prisma';

const createReview = async (reviewData: Review) => {
  const result = await prisma.review.create({
    data: reviewData,
  });
  return result;
};
export const reviewService = {
  createReview,
};
