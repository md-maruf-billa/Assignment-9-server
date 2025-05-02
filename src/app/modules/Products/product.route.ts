import { Router } from 'express';
import auth from '../../middlewares/auth';
import { Role } from '../../interface/AllModelInterfaces';
import { productController } from './product.controller';
import RequestValidator from '../../middlewares/requestValidator';
import { ProductValidation } from './product.validation';

const router = Router();

router.get('/', auth(Role.ADMIN), productController.getProducts);
router.get('/:id', auth(Role.ADMIN), productController.getSingleProduct);
router.post(
  '/create-product',
  RequestValidator(ProductValidation.createProduct),
  auth(Role.ADMIN),
  productController.createProduct,
);
router.patch(
  '/update-product',
  RequestValidator(ProductValidation.updateProduct),
  auth(Role.ADMIN),
  productController.updateProduct,
);
router.delete(
  '/delete-product',
  auth(Role.ADMIN),
  productController.softDeleteProduct,
);
export const productRouters = router;
