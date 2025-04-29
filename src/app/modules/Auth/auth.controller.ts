import configs from '../../configs';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { AuthService } from './auth.services';

const loginUser = catchAsyncResponse(async (req, res) => {
  const { email, password } = req.body;
  // Simulate a successful login response
  const result = await AuthService.loginUser({
    email,
    password,
  });

  manageResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User login successfully!',
    data: {},
  });
});

export const AuthController = {
  loginUser,
};
