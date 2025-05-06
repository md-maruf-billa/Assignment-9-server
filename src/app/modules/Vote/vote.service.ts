import status from 'http-status';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/Prisma';
import { VoteType } from '@prisma/client';

const castVote = async (
  accountEmail: string,
  reviewId: string,
  type: VoteType,
) => {
  // ✅ Check if the review exists
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError(
      'The review you are trying to vote on does not exist',
      status.NOT_FOUND,
    );
  }

  // ✅ Check if the vote already exists
  const existingVote = await prisma.vote.findUnique({
    where: { reviewId_accountEmail: { reviewId, accountEmail } },
  });

  if (existingVote) {
    // Update existing vote if type is different
    if (existingVote.type !== type) {
      return await prisma.vote.update({
        where: { reviewId_accountEmail: { reviewId, accountEmail } },
        data: { type },
      });
    } else {
      // If same vote type, return without change
      return existingVote;
    }
  }

  // ✅ Create a new vote
  return await prisma.vote.create({
    data: { reviewId, accountEmail, type },
  });
};

const unvote = async (accountEmail: string, reviewId: string) => {
  const vote = await prisma.vote.findUnique({
    where: { reviewId_accountEmail: { reviewId, accountEmail } },
  });

  if (!vote) {
    throw new AppError('No existing vote to remove', status.NOT_FOUND);
  }

  return await prisma.vote.delete({
    where: { reviewId_accountEmail: { reviewId, accountEmail } },
  });
};

const getAllVote = async () => {
  return await prisma.vote.findMany();
};

export const voteService = {
  castVote,
  unvote,
  getAllVote,
};
