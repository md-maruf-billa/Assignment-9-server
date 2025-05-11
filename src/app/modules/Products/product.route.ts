import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { productController } from './product.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { ProductValidation } from './product.validation';
import uploader from '../../middlewares/uploader';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getSingleProduct);
router.post(
  '/create-product',
  auth('COMPANY', 'ADMIN'),
  uploader.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.createProduct.parse(JSON.parse(req.body.data));
    productController.createProduct(req, res, next);
  },
);
router.patch(
  '/update-product/:productId',
  uploader.single('image'),
  auth('COMPANY', 'ADMIN'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.updateProduct.parse(JSON.parse(req.body.data));
    productController.updateProduct(req, res, next);
  },
);
router.delete(
  '/delete-product/:productId',
  auth('COMPANY', 'ADMIN'),
  productController.softDeleteProduct,
);
export const productRouters = router;
