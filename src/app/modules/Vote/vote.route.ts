import { Router } from 'express';
import auth from '../../middlewares/auth';
import RequestValidator from '../../middlewares/requestValidator';
import { voteValidation } from './vote.validation';
import { voteController } from './vote.controller';

const router = Router();
router.get('/', voteController.getAllVote);
router.post(
  '/cast',
  auth('USER', 'COMPANY', 'ADMIN'),
  RequestValidator(voteValidation.createVote),
  voteController.castVote,
);

router.delete(
  '/unvote',
  auth('USER', 'COMPANY', 'ADMIN'),
  voteController.unVote,
);

export const voteRoutes = router;
