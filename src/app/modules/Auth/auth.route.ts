import { Router } from 'express';
import { AuthController } from './auth.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/login',
  RequestValidator(AuthValidation.loginUser),
  AuthController.login_user,
);
router.post(
  '/register',
  RequestValidator(AuthValidation.registerUser),
  AuthController.register_user,
);
router.get(
  '/me',
  auth("ADMIN", "COMPANY", "USER"),
  AuthController.get_my_profile,
);

router.post('/refresh-token', AuthController.refresh_token);
router.post(
  '/change-password',
  auth("ADMIN", "COMPANY", "USER"),
  RequestValidator(AuthValidation.changePassword),
  AuthController.change_password,
);
router.post(
  '/forgot-password',
  RequestValidator(AuthValidation.forgotPassword),
  AuthController.forget_password,
);
router.post(
  '/reset-password',
  RequestValidator(AuthValidation.resetPassword),
  AuthController.reset_password,
);
router.patch("/change-account-status", auth("ADMIN", "COMPANY", "USER"), RequestValidator(AuthValidation.change_status), AuthController.change_account_status)
export const authRouter = router;
