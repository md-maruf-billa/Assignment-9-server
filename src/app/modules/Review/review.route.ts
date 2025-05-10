import { Router } from 'express';
import { reviewController } from './review.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { reviewValidation } from './review.validation';
import auth from '../../middlewares/auth';

const router = Router();


router.get(
  '/',
  reviewController.getReview
);

router.get(
  '/premiumReviews',
  auth('ADMIN'),
  reviewController.getAllPremiumReview,
);

router.get('/:id', reviewController.getSingleReview);
router.get(
  '/user-email',
  auth('ADMIN', 'USER'),
  reviewController.getReviewByUserId,
);
router.post(
  '/create-review',
  auth('ADMIN', 'USER'),
  RequestValidator(reviewValidation.createReview),
  reviewController.createReview,
);
router.patch(
  '/update-review',
  auth('ADMIN', 'USER'),
  RequestValidator(reviewValidation.updateReview),
  reviewController.updateReview,
);
router.delete(
  '/delete-review',
  auth('ADMIN', 'USER'),
  reviewController.deleteReview,
);
router.post(
  '/create-review/',
  auth('USER', 'ADMIN'),
  RequestValidator(reviewValidation.createReview),
  reviewController.createReview,
);

export default router;
// primeReview updated
