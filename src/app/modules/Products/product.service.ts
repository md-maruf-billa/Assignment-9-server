import { Product } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { Request } from 'express';
import uploadCloud from '../../utils/cloudinary';

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

const createProduct = async (req: Request) => {
  const { email } = req.user;
  const isAccountExist = await prisma.account.findUnique({ where: { email }, include: { company: true } })
  if (!isAccountExist) {
    throw new AppError("Company account not authorized !!", httpStatus.NOT_FOUND)
  }
  if (req.file) {
    const uploadedImage = await uploadCloud(req.file);
    req.body.imageUrl = uploadedImage?.secure_url
  }
  req.body.companyId = isAccountExist?.company?.id

  const result = await prisma.product.create({
    data: req.body,
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
