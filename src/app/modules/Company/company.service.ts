import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/Prisma"
import httpStatus from 'http-status';
import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";
import { IOptions, paginationHelper } from "../../utils/peginationHelper";
import { Prisma } from "@prisma/client";
import { companySearchTerm } from "./company.constant";

const get_all_companies_from_db = async (
    filters: any,
    options: IOptions
) => {

    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const andConditions: Prisma.CompanyWhereInput[] = [];

    // Search Logic
    if (searchTerm) {
        andConditions.push({
            OR: companySearchTerm.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    };

    // Filter Logic
    if (filterData.name) {
        andConditions.push({
            name: {
                contains: filterData.name,
                mode: 'insensitive',
            },
        });
    }

    if (filterData.email) {
        andConditions.push({
            account: {
                email: {
                    contains: filterData.email,
                    mode: 'insensitive',
                },
            },
        });
    }


    andConditions.push({
        isDeleted: false
    });

    const whereConditions: Prisma.CompanyWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};


    const result = await prisma.company.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            account: true,
            products: true
        }
    });

    const total = await prisma.company.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            skip,
            total,
        },
        data: result
    };
}


const get_specific_company_from_db = async (id: string) => {
    const result = await prisma.company.findUnique({
        where: { id, isDeleted: false },
        include: {
            account: true,
            products: {
                include: {
                    category: true,
                    reviews: {
                        include: {
                            ReviewComment: {
                                include: {
                                    account: {
                                        include: {
                                            user: true,
                                            admin: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    });

    if (!result) {
        throw new AppError("Company not found!", httpStatus.NOT_FOUND);
    }

    // Enrich each review with product + category details
    const allReviews = result.products.flatMap(product => {
        return product.reviews
            .filter(review => !review.isDeleted)
            .map(review => ({
                ...review,
                productId: product.id,
                productName: product.name,
                categoryId: product.categoryId,
                categoryName: product.category?.name || null
            }));
    });

    // Remove `reviews` and `category` from each product to avoid duplication
    const productsWithoutReviews = result.products.map(product => {
        const { reviews, category, ...rest } = product;
        return rest;
    });

    return {
        ...result,
        products: productsWithoutReviews,
        reviews: allReviews
    };
};


const update_company_info_into_db = async (req: Request) => {
    // find first account
    const isAccountExist = await prisma.account.findUnique({ where: { email: req?.user?.email, status: "ACTIVE", isDeleted: false }, include: { company: true } })
    const isExistCompany = await prisma.company.findUnique({ where: { accountId: isAccountExist?.id } })
    if (!isExistCompany) {
        throw new AppError("Company info not found!!", httpStatus.NOT_FOUND)
    }
    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        req.body.companyImage = uploadedImage?.secure_url
    }
    const updatedInfo = await prisma.company.update({ where: { id: isExistCompany.id }, data: req.body })
    return updatedInfo;
}

const delete_account_into_db = async (email: string) => {
    const isExistAccount = await prisma.account.findUnique({ where: { email, isDeleted: false }, include: { company: true } })
    if (!isExistAccount) {
        throw new AppError("Account not found !!", httpStatus.NOT_FOUND)
    }
    await prisma.$transaction(async (tranClient) => {
        await tranClient.account.update({ where: { email }, data: { isDeleted: true } })
        await tranClient.company.update({ where: { id: isExistAccount.company?.id }, data: { isDeleted: true } })
    })
    return;
}

export const company_services = {
    get_all_companies_from_db,
    get_specific_company_from_db,
    update_company_info_into_db,
    delete_account_into_db
}