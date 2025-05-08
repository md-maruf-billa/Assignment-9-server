import z from 'zod';

const createVote = z.object({
  reviewId: z.string(),
  type: z.enum(['UPVOTE', 'DOWNVOTE']),
});

export const voteValidation = {
  createVote,
};
