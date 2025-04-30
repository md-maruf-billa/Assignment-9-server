import { Category } from '@prisma/client';
import { prisma } from '../../utils/Prisma';

const createCategory = async (reviewData: Category) => {
  const result = await prisma.category.create({
    data: reviewData,
  });
  return result;
};
export const categoryService = {
  createCategory,
};
