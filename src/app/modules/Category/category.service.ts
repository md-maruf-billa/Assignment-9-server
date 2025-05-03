import { Category } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { Request } from 'express';
import uploadCloud from '../../utils/cloudinary';

const createCategory = async (req: Request) => {
    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        req.body.categoryImage = uploadedImage?.secure_url;
    };

    return await prisma.category.create({
        data: req.body
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
    req: Request
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

    const dataToUpdate: Partial<{
        name: string;
        categoryImage: string;
    }> = {};

    if (req.body.name) {
        dataToUpdate.name = req.body.name;
    }

    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        dataToUpdate.categoryImage = uploadedImage?.secure_url;
    }

    return await prisma.category.update({
        where: {
            id
        },
        data: dataToUpdate
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
