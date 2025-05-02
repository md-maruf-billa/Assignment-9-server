import { Product } from '@prisma/client';
import { prisma } from '../../utils/Prisma';

const getProduct = async () => {
  const result = await prisma.product.findMany();
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: { id: id, isDeleted: false },
  });
  return result;
};

const createProduct = async (data: Product) => {
  const result = await prisma.product.create({
    data: data,
  });
  return result;
};
const updateProduct = async (id: string, data: Product) => {
  const result = await prisma.product.update({
    where: { id: id },
    data: data,
  });
  return result;
};

const softDeleteProduct = async (id: string) => {
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
