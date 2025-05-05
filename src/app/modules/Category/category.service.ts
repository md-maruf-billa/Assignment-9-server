import { Prisma } from '@prisma/client';
import { prisma } from '../../utils/Prisma';
import { AppError } from '../../utils/AppError';
import httpStatus from 'http-status';
import { Request } from 'express';
import uploadCloud from '../../utils/cloudinary';
import {
    IOptions,
    paginationHelper
} from '../../utils/peginationHelper';
import { categorySearchTerm } from './category.constant';



const createCategory = async (req: Request) => {
    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        req.body.categoryImage = uploadedImage?.secure_url;
    };

    return await prisma.category.create({
        data: req.body
    });
};


const getCategories = async (
    filters: any,
    options: IOptions
) => {
    const { searchTerm, ...filterData } = filters;
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const andConditions: Prisma.CategoryWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: categorySearchTerm.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    contains: (filterData as any)[key],
                    mode: 'insensitive',
                },
            })),
        });
    }

    const whereConditons: Prisma.CategoryWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.category.findMany({
        where: whereConditons,
        include: {
            reviews: true,
            _count: true,
        },
        skip,
        take: limit,

    });

    const total = await prisma.category.count({
        where: whereConditons,
    });

    return {
        meta: {
            page,
            limit,
            skip,
            total
        },
        data: result,
    };
};



// const getCategories = async (
//     filters: any,
//     options: IOptions
// ) => {

//     const { searchTerm, ...filterData } = filters;

//     const { limit, page, skip } = paginationHelper.calculatePagination(options);


//     const andConditions: Prisma.CategoryWhereInput[] = [];

//     if (searchTerm) {
//         andConditions.push({
//             OR: categorySearchTerm.map(field => ({
//                 [field]: {
//                     contains: searchTerm,
//                     mode: 'insensitive',
//                 },
//             })),
//         });
//     };

//     // console.log(andConditions);

//     if (Object.keys(filterData).length > 0) {
//         andConditions.push({
//             AND: Object.keys(filterData).map(key => ({
//                 [key]: {
//                     equals: (filterData as any)[key]
//                 }
//             }))
//         })
//     };

//     const whereConditons: Prisma.CategoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};



//     const result = await prisma.category.findMany({
//         include: {
//             reviews: true,
//             _count: true
//         }
//     });

//     const total = await prisma.category.count({
//     });


//     return { total, result };
// };

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
