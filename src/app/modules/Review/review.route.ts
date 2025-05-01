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
  auth(Role.ADMIN, Role.USER),
  reviewController.createReview,
);
router.patch(
  '/update-review',
  RequestValidator(reviewValidation.updateReview),
  auth(Role.ADMIN, Role.USER),
  reviewController.updateReview,
);
router.delete(
  '/delete-review',
  auth(Role.ADMIN, Role.USER),
  reviewController.deleteReview,
);

export const reviewRouter = router;
