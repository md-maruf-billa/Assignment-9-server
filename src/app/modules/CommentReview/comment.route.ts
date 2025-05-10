import { Router } from 'express';
import { commentController } from './comment.controller';
import auth from '../../middlewares/auth';
import RequestValidator from '../../middlewares/requestValidator';
import { ReviewCommentValidation } from './comment.validation';

const router = Router();

router.get('/', commentController.getComments);
router.get('/:id', commentController.getSingleComment);

router.post(
  '/create-comment',
  auth('USER', 'ADMIN', "COMPANY"),
  RequestValidator(ReviewCommentValidation.createReviewComment),
  commentController.createComment,
);

router.patch(
  '/update-comment',
  auth('USER', 'ADMIN', "COMPANY"),
  RequestValidator(ReviewCommentValidation.updateReviewComment),
  commentController.updateComment,
);

router.delete(
  '/delete-comment',
  auth('USER', 'ADMIN', "COMPANY"),
  commentController.softDeleteComment,
);

export const commentRouters = router;
