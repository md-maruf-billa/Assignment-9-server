import { Prisma, Product } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { Request } from 'express';
import uploadCloud from '../../utils/cloudinary';
import { IOptions, paginationHelper } from '../../utils/peginationHelper';

const getProduct = async (filters: any, options: IOptions) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.ProductWhereInput[] = [];

  // Search Logic
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          company: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    });
  }

  // Filter Logic
  if (filterData.name) {
    andConditions.push({
      name: {
        contains: filterData.name,
        mode: 'insensitive',
      },
    });
  }

  if (filterData.price) {
    andConditions.push({
      price: {
        equals: Number(filterData.price),
      },
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: {
      company: true,
    },
  });

  const total = await prisma.product.count({
    where: {
      isDeleted: false,
    },
  });

  return {
    meta: {
      page,
      limit,
      skip,
      total,
    },
    result,
  };
};

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id: id, isDeleted: false },
    include: {
      reviews: {
        include: {
          ReviewComment: {
            include: {
              account: {
                include: {
                  user: true,
                  admin: true,
                }
              }
            }
          },
        }
      }
    }
  });
  if (!result) {
    throw new AppError('Product not found!!', httpStatus.NOT_FOUND);
  }
  return result;
};
const get_product_by_category_from_db = async (id: string) => {
  const result = await prisma.product.findMany({
    where: { categoryId: id },
    include: { reviews: true }

  });

  return result;
};

const createProduct = async (req: Request) => {
  const { email } = req.user;
  const isAccountExist = await prisma.account.findUnique({
    where: { email },
    include: { company: true },
  });
  if (!isAccountExist) {
    throw new AppError(
      'Company account not authorized !!',
      httpStatus.NOT_FOUND,
    );
  }
  if (req.file) {
    const uploadedImage = await uploadCloud(req.file);
    req.body.imageUrl = uploadedImage?.secure_url;
  }
  req.body.companyId = isAccountExist?.company?.id;
  const result = await prisma.product.create({
    data: req.body,
  });
  return result;
};

const updateProduct = async (id: string, requestData: Request) => {
  const isExistProduct = await prisma.product.findUnique({ where: { id } });
  if (!isExistProduct) {
    throw new AppError('Product not found !!', httpStatus.NOT_FOUND);
  }
  if (requestData.file) {
    const uploadedImage = await uploadCloud(requestData.file);
    requestData.body.imageUrl = uploadedImage?.secure_url;
  }

  const result = await prisma.product.update({
    where: { id: id },
    data: requestData.body,
    include: { company: true, category: true },
  });
  return result;
};

const softDeleteProduct = async (id: string) => {
  const isExistProduct = await prisma.product.findUnique({ where: { id } });
  if (!isExistProduct) {
    throw new AppError('Product not found !!', httpStatus.NOT_FOUND);
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
  get_product_by_category_from_db
};
