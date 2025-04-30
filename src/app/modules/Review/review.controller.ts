import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { reviewService } from './review.service';

const createReview = catchAsyncResponse(async (req, res) => {
  const result = await reviewService.createReview(req.body);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});
export const reviewController = {
  createReview,
};
