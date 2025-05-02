import { Router } from 'express';
import auth from '../../middlewares/auth';
import { productController } from './product.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { ProductValidation } from './product.validation';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getSingleProduct);
router.post(
  '/create-product',
  auth("COMPANY"),
  RequestValidator(ProductValidation.createProduct),
  productController.createProduct,
);
router.patch(
  '/update-product',
  auth("COMPANY"),
  RequestValidator(ProductValidation.updateProduct),
  productController.updateProduct,
);
router.delete(
  '/delete-product',
  auth("COMPANY"),
  productController.softDeleteProduct,
);
export const productRouters = router;
