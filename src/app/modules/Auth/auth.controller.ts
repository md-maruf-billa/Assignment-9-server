import configs from '../../configs';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { AuthService } from './auth.services';
import httpStatus from 'http-status';

const resiterUser = catchAsyncResponse(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const result = await AuthService.registerUser({
    email,
    password,
    firstName,
    lastName,
  });

  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'User registration failed!',
      data: null,
    });
    return;
  }

  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const loginUser = catchAsyncResponse(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser({
    email,
    password,
  });

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User login successfully!',
    data: result,
  });
});

const getMyProfile = catchAsyncResponse(async (req, res) => {
  const { email } = req.user as { email: string };
  const result = await AuthService.getMyProfile(email);

  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'User not found!',
      data: null,
    });
    return;
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

export const AuthController = {
  resiterUser,
  getMyProfile,
  loginUser,
};
