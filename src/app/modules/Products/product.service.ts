import { Product } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';

const getProduct = async () => {
  const result = await prisma.product.findMany();
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id: id, isDeleted: false },
  });
  if (!result) {
    throw new AppError("Product not found!!", httpStatus.NOT_FOUND)
  }
  return result;
};

const createProduct = async (data: Product) => {
  const result = await prisma.product.create({
    data: data,
  });
  return result;
};
const updateProduct = async (id: string, data: Product) => {
  const isExistProduct = await prisma.product.findUnique({ where: { id } })
  if (!isExistProduct) {
    throw new AppError("Product not found !!", httpStatus.NOT_FOUND)
  }
  const result = await prisma.product.update({
    where: { id: id },
    data: data,
  });
  return result;
};

const softDeleteProduct = async (id: string) => {
  const isExistProduct = await prisma.product.findUnique({ where: { id } })
  if (!isExistProduct) {
    throw new AppError("Product not found !!", httpStatus.NOT_FOUND)
  }
  const result = await prisma.product.update({
    where: { id: id, isDeleted: false },
    data: { isDeleted: true },
  });
  return result;
};

export const productService = {
  getProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
