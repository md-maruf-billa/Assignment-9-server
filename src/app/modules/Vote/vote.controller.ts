import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { voteService } from './vote.service';

const castVote = catchAsyncResponse(async (req, res) => {
  const { reviewId, type } = req.body;
  const accountEmail = req.user.email;

  const result = await voteService.castVote(accountEmail, reviewId, type);

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vote cast successfully',
    data: result,
  });
});

const unVote = catchAsyncResponse(async (req, res) => {
  const { reviewId } = req.query;
  const accountEmail = req.user.email;

  const result = await voteService.unvote(accountEmail, reviewId as string);

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vote removed successfully',
    data: result,
  });
});
const getAllVote = catchAsyncResponse(async (req, res) => {
  const result = await voteService.getAllVote();
  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All votes retrieved successfully',
    data: result,
  });
});

export const voteController = {
  castVote,
  unVote,
  getAllVote,
};
