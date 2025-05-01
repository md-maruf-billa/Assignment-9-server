import { Category } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';

const createCategory = async (payload: Category) => {
    return await prisma.category.create({
        data: payload,
    });
};


const getCategories = async () => {
    const result = await prisma.category.findMany({
        include: {
            reviews: true,
            _count: true
        }
    });
    return result;
};


const getCategoryById = async (id: string) => {
    const result = await prisma.category.findUnique({
        where: {
            id
        },
        include: {
            reviews: true,
            _count: true
        }
    });
    if (!result) {
        throw new AppError(
            "Category Not Found",
            httpStatus.NOT_FOUND
        );
    };
    return result;
};


const updateCategory = async (
    id: string,
    payload: Category
) => {
    const isExist = await prisma.category.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new AppError(
            "Category Not Found",
            httpStatus.NOT_FOUND
        );
    };

    return await prisma.category.update({
        where: {
            id
        },
        data: payload
    });
};


const deleteCategory = async (id: string) => {
    const isExist = await prisma.category.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new AppError(
            "Category Not Found",
            httpStatus.NOT_FOUND
        );
    };

    return await prisma.category.delete({
        where: {
            id
        }
    });
};


export const categoryService = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
