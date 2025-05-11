import { AccountStatus } from '@prisma/client';
import configs from '../../configs';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { AuthService } from './auth.services';
import httpStatus from 'http-status';

const register_user = catchAsyncResponse(async (req, res) => {
  const result = await AuthService.register_user_into_db(req?.body);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const login_user = catchAsyncResponse(async (req, res) => {
  const result = await AuthService.login_user_from_db(req.body);

  res.cookie('refreshToken', result.refreshToken, {
    secure: configs.env == 'production',
    httpOnly: true,
  });
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successful !',
    data: {
      accessToken: result.accessToken,
    },
  });
});

const get_my_profile = catchAsyncResponse(async (req, res) => {
  const { email } = req?.user;
  const result = await AuthService.get_my_profile_from_db(email);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

const refresh_token = catchAsyncResponse(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refresh_token_from_db(refreshToken);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refresh token generated successfully!',
    data: result,
  });
});

const change_password = catchAsyncResponse(async (req, res) => {
  const user = req?.user;
  const result = await AuthService.change_password_from_db(user, req.body);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
    data: result,
  });
});

const forget_password = catchAsyncResponse(async (req, res) => {
  const { email } = req?.body
  await AuthService.forget_password_from_db(email);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset password link sent to your email!',
    data: null,
  });
});

const reset_password = catchAsyncResponse(async (req, res) => {
  const { token, newPassword, email } = req.body;
  const result = await AuthService.reset_password_into_db(
    token,
    email,
    newPassword,
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

const change_account_status = catchAsyncResponse(async (req, res) => {
  const payload = {
    email: req?.body?.email || req?.user?.email,
    status: req?.body?.status as AccountStatus
  }
  const result = await AuthService.change_account_status_into_db(payload)
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Changed !",
    data: result
  })
})

export const AuthController = {
  register_user,
  get_my_profile,
  login_user,
  refresh_token,
  change_password,
  forget_password,
  reset_password,
  change_account_status
};
