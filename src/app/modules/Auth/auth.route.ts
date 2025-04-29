import { Router } from 'express';
import { AuthController } from './auth.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  RequestValidator(AuthValidation.loginUser),
  AuthController.loginUser,
);
router.post(
  '/register',
  RequestValidator(AuthValidation.registerUser),
  AuthController.resiterUser,
);
router.get(
  '/me',
  RequestValidator(AuthValidation.getMyProfile),
  AuthController.getMyProfile,
);

router.post('/refresh-token', AuthController.RefreshToken);
router.post(
  '/change-password',
  RequestValidator(AuthValidation.changePassword),
  AuthController.changePassword,
);
router.post(
  '/forgot-password',
  RequestValidator(AuthValidation.forgotPassword),
  AuthController.forgotPassword,
);

export const authRouter = router;
