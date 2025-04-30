import { Router } from 'express';
import RequestValidator from '../../middlewares/requestValidator';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';

const router = Router();

router.post(
  '/create-category',
  RequestValidator(categoryValidation.createCategory),
  categoryController.createCategory,
);

export const categoryRouter = router;
