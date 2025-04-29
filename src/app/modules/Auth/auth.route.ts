import { Router } from 'express';
import requestValidator from '../../middlewares/requestValidator';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/login', AuthController.loginUser);

export const authRouter = router;
