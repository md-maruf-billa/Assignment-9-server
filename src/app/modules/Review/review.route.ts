import { Router } from 'express';
import { reviewController } from './review.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { reviewValidation } from './review.validation';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post(
  '/create-review',
  RequestValidator(reviewValidation.createReview),
  auth(Role.USER, Role.ADMIN),
  reviewController.createReview,
);

export const reviewRouter = router;
