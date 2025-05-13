import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { reviewService } from './review.service';
import pickQuery from '../../utils/pickQuery';
import {
  reviewFilterableFields,
  reviewPaginationFields,
} from './review.constant';

const getReview = catchAsyncResponse(async (req, res) => {
  const filters = pickQuery(req.query, reviewFilterableFields);
  const options = pickQuery(req.query, reviewPaginationFields);

  const result = await reviewService.getReview(filters, options);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleReview = catchAsyncResponse(async (req, res) => {
  const result = await reviewService.getSingleReview(req.params.id);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review fetched successfully',
    data: result,
  });
});

const getReviewByUserId = catchAsyncResponse(async (req, res) => {
  const { email } = req?.user;
  const result = await reviewService.getReviewByUserId(email);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews fetched successfully by user ID',
    data: result,
  });
});

const createReview = catchAsyncResponse(async (req, res) => {
  const { email } = req?.user;
  const result = await reviewService.createReview(req.body, email);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const updateReview = catchAsyncResponse(async (req, res) => {
  const { reviewId } = req?.query;
  const { email } = req?.user;
  const result = await reviewService.updateReview(
    req.body,
    reviewId as string,
    email as string,
  );
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review Updated successfully',
    data: result,
  });
});

const deleteReview = catchAsyncResponse(async (req, res) => {
  const { reviewId } = req?.query;
  const { email } = req?.user;
  await reviewService.deleteReview(reviewId as string, email as string);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review deleted successfully (soft delete)',
    data: null,
  });
});

const getAllPremiumReview = catchAsyncResponse(async (req, res) => {
  const result = await reviewService.getAllPremiumReview();
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All premium reviews fetched successfully',
    data: result,
  });
});

const manage_votes = catchAsyncResponse(async (req, res) => {
  const { reviewId, type } = req?.query;
  const { email } = req?.user;
  const result = await reviewService.manage_votes_into_db(
    reviewId as string,
    type as string,
    email as string,
  );
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Voting don.',
    data: result,
  });
});

const approveReview = catchAsyncResponse(async (req, res) => {
  const { reviewId, status } = req.body;
  const result = await reviewService.approveReview(reviewId, status);
  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: `Review ${status.toLowerCase()} successfully`,
    data: result,
  });
});

export const reviewController = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getSingleReview,
  getReviewByUserId,
  getAllPremiumReview,
  manage_votes,
  approveReview,
};
