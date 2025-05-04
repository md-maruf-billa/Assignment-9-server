import { NextFunction, Request, Response, Router } from 'express';
import RequestValidator from '../../middlewares/requestValidator';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';
import uploader from '../../middlewares/uploader';

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
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = categoryValidation.createCategory.parse(JSON.parse(req.body.data))
        categoryController.createCategory(req, res, next)
    },
);


router.patch(
    '/update/:id',
    auth("ADMIN"),
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = categoryValidation.updateCategory.parse(JSON.parse(req.body.data));
        } else {
            req.body = {};
        }
        categoryController.updateCategory(req, res, next);
    }
);


router.delete(
    '/delete/:id',
    auth("ADMIN"),
    categoryController.deleteCategory
);

export const categoryRouter = router;
