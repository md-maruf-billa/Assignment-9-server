import status from 'http-status';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/Prisma';
import { Request } from 'express';
import uploadCloud from '../../utils/cloudinary';
import { IOptions, paginationHelper } from '../../utils/peginationHelper';
import { Prisma } from '@prisma/client';
import { EmailSender } from '../../utils/emailSender';

// get all users
const getUsers = async (
    filters: any,
    options: IOptions
) => {

    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const andConditions: Prisma.UserWhereInput[] = [];

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
                    bio: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    account: {
                        email: {
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
    if (filterData.email) {
        andConditions.push({
            account: {
                email: {
                    contains: filterData.email,
                    mode: 'insensitive'
                }
            }
        })
    }

    andConditions.push({
        isDeleted: false
    })

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const users = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                    isPremium: true,
                }
            }
        }
    });
    const total = await prisma.user.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            skip,
            total
        },
        users
    };
};


// find by id
const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                    isPremium: true
                }
            }
        }
    });
    if (!user) {
        throw new AppError(
            'User not found',
            status.NOT_FOUND
        );
    };

    return user;
};

// update user
const updateUser = async (
    email: string,
    req: Request
) => {

    // find account and user account
    const isAccountExist = await prisma.account.findUnique({
        where: {
            email,
            isDeleted: false
        },
        include: {
            user: true,
            admin: true
        }
    })
    if (!isAccountExist) {
        throw new AppError(
            'User not found',
            status.NOT_FOUND
        );
    };

    // main update logic
    if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        req.body.profileImage = uploadedImage?.secure_url;
    };

    await prisma.$transaction(async (tClient) => {
        if (isAccountExist?.role == "ADMIN") {
            await tClient.admin.update({
                where: {
                    id: isAccountExist?.admin?.id,
                },
                data: req.body,
            });
        } else {
            await tClient.user.update({
                where: {
                    id: isAccountExist?.user?.id
                },
                data: req.body,
                include: {
                    account: true
                }
            });
        }

        await tClient.account.update({
            where: {
                email
            },
            data: {
                isCompleteProfile: true
            },
            include: {
                user: true
            }
        });
    });
    EmailSender(
        isAccountExist?.email,
        "Profile update successful.",
        `
          <p>Hi there,</p>
      
          <p>Your profile is successfully updated. Thanks for stay with us.😍😍😍😍</p>
        `
    )
    return "Profile update successful."
};


// delete user
const deleteUserFromDB = async (email: string) => {
    const isAccountExist = await prisma.account.findUnique({
        where: {
            email,
            isDeleted: false
        },
        include: {
            user: true
        },
    });
    if (!isAccountExist) {
        throw new AppError(
            'Account not found',
            status.NOT_FOUND
        );
    };


    return await prisma.$transaction(async (tClient) => {
        const deleteUser = await tClient.user.update({
            where: {
                id: isAccountExist?.user?.id
            },
            data: {
                isDeleted: true
            }
        });

        await tClient.account.update({
            where: {
                email
            },
            data: {
                isDeleted: true
            }
        });
        return { isDeleted: deleteUser.isDeleted };
    });
};


export const userService = {
    getUsers,
    getUserById,
    updateUser,
    deleteUserFromDB,
};
