import { Router } from 'express';
import RequestValidator from '../../middlewares/requestValidator';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';

const router = Router();

router.get(
    '/',
    categoryController.getCategories
);

router.get(
    '/:id',
    categoryController.getCategoryById
)

router.post(
    '/create-category',
    RequestValidator(categoryValidation.createCategory),
    categoryController.createCategory,
);

router.patch(
    '/:id',
    RequestValidator(categoryValidation.updateCategory),
    categoryController.updateCategory
);


router.delete(
    '/delete/:id',
    categoryController.deleteCategory
);

export const categoryRouter = router;
