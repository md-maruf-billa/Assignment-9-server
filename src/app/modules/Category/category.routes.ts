import { Router } from 'express';
import RequestValidator from '../../middlewares/requestValidator';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
    '/',
    categoryController.getCategories
);

router.get(
    '/:id',
    categoryController.getCategoryById
);

router.post(
    '/create-category',
    auth("ADMIN"),
    RequestValidator(categoryValidation.createCategory),
    categoryController.createCategory,
);

router.patch(
    '/update/:id',
    auth("ADMIN"),
    RequestValidator(categoryValidation.updateCategory),
    categoryController.updateCategory
);


router.delete(
    '/delete/:id',
    auth("ADMIN"),
    categoryController.deleteCategory
);

export const categoryRouter = router;
