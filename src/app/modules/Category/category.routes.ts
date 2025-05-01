import { Router } from 'express';
import RequestValidator from '../../middlewares/requestValidator';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { Role } from '@prisma/client';

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
    auth(Role.ADMIN),
    RequestValidator(categoryValidation.createCategory),
    categoryController.createCategory,
);

router.patch(
    '/update/:id',
    auth(Role.ADMIN),
    RequestValidator(categoryValidation.updateCategory),
    categoryController.updateCategory
);


router.delete(
    '/delete/:id',
    auth(Role.ADMIN),
    categoryController.deleteCategory
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
