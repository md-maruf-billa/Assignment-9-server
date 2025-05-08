import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { productService } from './product.service';
import { Request } from 'express';
import pickQuery from '../../utils/pickQuery';
import {
  productFilterableFields,
  productPaginationFields,
} from './product.constant';

const getProducts = catchAsyncResponse(async (req, res) => {
  const filters = pickQuery(req.query, productFilterableFields);
  const options = pickQuery(req.query, productPaginationFields);

  const result = await productService.getProduct(filters, options);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Products fetched successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getSingleProduct = catchAsyncResponse(async (req, res) => {
  const result = await productService.getSingleProduct(req.params.id);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Single Product fetched successfully',
    data: result,
  });
});

const createProduct = catchAsyncResponse(async (req, res) => {
  console.log(req.body?.data)
  const result = await productService.createProduct(req as Request);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});
const updateProduct = catchAsyncResponse(async (req, res) => {
  const { productId } = req?.params;
  const result = await productService.updateProduct(
    productId as string,
    req as Request,

  );

  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});
const softDeleteProduct = catchAsyncResponse(async (req, res) => {
  const { productId } = req?.params;
  const result = await productService.softDeleteProduct(productId as string);
  manageResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});
export const productController = {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
