import { Router } from 'express';
import { reviewController } from './review.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { reviewValidation } from './review.validation';

const router = Router();

router.post(
  '/create-review',
  RequestValidator(reviewValidation.createReview),
  reviewController.createReview,
);

export const reviewRouter = router;
