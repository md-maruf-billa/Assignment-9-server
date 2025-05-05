import { prisma } from '../../utils/Prisma';

const castVote = async (
  accountId: string,
  reviewId: string,
  type: 'UPVOTE' | 'DOWNVOTE',
) => {
  const existingVote = await prisma.vote.findUnique({
    where: { reviewId_accountId: { reviewId, accountId } },
  });

  if (existingVote) {
    // Update vote type if changed
    return await prisma.vote.update({
      where: { reviewId_accountId: { reviewId, accountId } },
      data: { type },
    });
  }

  // Create a new vote
  return await prisma.vote.create({
    data: { reviewId, accountId, type },
  });
};
// console.log();'
// const unvote = async (accountId: string, reviewId: string) => {
//   const vote = await prisma.vote.findUnique({
//     where: { reviewId_accountId: { reviewId, accountId } }
//   });

//   if (!vote) {
//     throw new AppError('No existing vote to remove', httpStatus.NOT_FOUND);
//   }

//   return await prisma.vote.delete({
//     where: { reviewId_accountId: { reviewId, accountId } },
//   });
// };

export const voteService = {
  castVote,
  //   unvote,
};
