import status from 'http-status';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/Prisma';
import { Request } from 'express';

const getAllComments = async () => {
  const result = await prisma.reviewComment.findMany({
    where: { isDeleted: false },
  });
  return result;
};

const getSingleComment = async (id: string) => {
  const result = await prisma.reviewComment.findUnique({
    where: { id },
    // include: {
    //   account: true,
    //   review: true,
    // },
  });

  if (!result || result.isDeleted) {
    throw new AppError('Comment not found !!', status.NOT_FOUND);
  }
  return result;
};

const createComment = async (req: Request) => {
  const { reviewId, accountId, content } = req.body;

  if (!reviewId || !accountId || !content) {
    throw new AppError('Missing required fields!', status.BAD_REQUEST);
  }

  const result = await prisma.reviewComment.create({
    data: {
      reviewId,
      accountId,
      content,
    },
  });
  return result;
};

const updateComment = async (id: string, data: { content: string }) => {
  const isExist = await prisma.reviewComment.findUnique({ where: { id } });

  if (!isExist || isExist.isDeleted) {
    throw new AppError('Comment not found !!', status.NOT_FOUND);
  }

  const result = await prisma.reviewComment.update({
    where: { id },
    data: {
      content: data.content,
    },
  });

  return result;
};

const softDeleteComment = async (id: string) => {
  const isExist = await prisma.reviewComment.findUnique({ where: { id } });

  if (!isExist || isExist.isDeleted) {
    throw new AppError('Comment not found !!', status.NOT_FOUND);
  }

  const result = await prisma.reviewComment.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const commentService = {
  getAllComments,
  getSingleComment,
  createComment,
  updateComment,
  softDeleteComment,
};
