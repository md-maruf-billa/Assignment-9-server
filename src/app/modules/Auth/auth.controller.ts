import configs from '../../configs';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { AuthService } from './auth.services';
import httpStatus from 'http-status';

const resiterUser = catchAsyncResponse(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  console.log({
    email,
    password,
    firstName,
    lastName,
  });
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

  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid email or password!',
      data: null,
    });
    return;
  }
  const { accessToken, ...userData } = result;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: configs.env === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User login successfully!',
    data: {
      user: userData,
      accessToken: accessToken,
    },
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

const RefreshToken = catchAsyncResponse(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid refresh token!',
      data: null,
    });
    return;
  }
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refresh token generated successfully!',
    data: result,
  });
});

const changePassword = catchAsyncResponse(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  const result = await AuthService.changePassword(user, {
    oldPassword,
    newPassword,
  });
  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid old password!',
      data: null,
    });
    return;
  }
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: null,
  });
});

const forgotPassword = catchAsyncResponse(async (req, res) => {
  await AuthService.forgetPassword(req.body);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Check your email!',
    data: null,
  });
});

const resetPassword = catchAsyncResponse(async (req, res) => {
  const { token, newPassword, email } = req.body;
  const result = await AuthService.resetPassword(token, email, newPassword);

  if (!result) {
    manageResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid or expired token!',
      data: null,
    });
    return;
  }

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});
export const AuthController = {
  resiterUser,
  getMyProfile,
  loginUser,
  RefreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
