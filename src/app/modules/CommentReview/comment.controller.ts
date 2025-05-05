import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { commentService } from './comment.service';
import { Request } from 'express';

const getComments = catchAsyncResponse(async (req, res) => {
  const result = await commentService.getAllComments();
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Comments fetched successfully',
    data: result,
  });
});

const getSingleComment = catchAsyncResponse(async (req, res) => {
  const result = await commentService.getSingleComment(req.params.id);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single comment fetched successfully',
    data: result,
  });
});

const createComment = catchAsyncResponse(async (req, res) => {
  const result = await commentService.createComment(req as Request);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const updateComment = catchAsyncResponse(async (req, res) => {
  const { commentId } = req.query;
  const result = await commentService.updateComment(
    commentId as string,
    req.body,
  );
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const softDeleteComment = catchAsyncResponse(async (req, res) => {
  const { commentId } = req.query;
  const result = await commentService.softDeleteComment(commentId as string);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const commentController = {
  getComments,
  getSingleComment,
  createComment,
  updateComment,
  softDeleteComment,
};
