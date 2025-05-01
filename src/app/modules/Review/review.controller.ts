import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { reviewService } from './review.service';

const getReview = catchAsyncResponse(async (req, res) => {
  const result = await reviewService.getReview();
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
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
  const result = await reviewService.getReviewByUserId(req.params.userId);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Reviews fetched successfully by user ID',
    data: result,
  });
});

const createReview = catchAsyncResponse(async (req, res) => {
  const result = await reviewService.createReview(req.body);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const updateReview = catchAsyncResponse(async (req, res) => {
  const userId = req.query.userId;
  const reviewId = req.query.reviewId;
  if (!userId || !reviewId) {
    return manageResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: 'User ID and Review ID are required',
    });
  }
  const result = await reviewService.updateReview(
    req.body,
    reviewId as string,
    userId as string,
  );
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review Updated successfully',
    data: result,
  });
});
const deleteReview = catchAsyncResponse(async (req, res) => {
  const userId = req.query.userId;
  const reviewId = req.query.reviewId;

  if (!userId || !reviewId) {
    return manageResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: 'User ID and Review ID are required',
    });
  }

  const result = await reviewService.deleteReview(
    reviewId as string,
    userId as string,
  );

  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Review deleted successfully (soft delete)',
    data: null,
  });
});
export const reviewController = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getSingleReview,
  getReviewByUserId,
};
