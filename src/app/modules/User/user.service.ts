import status from 'http-status';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/Prisma';
import { Request } from 'express';
import { verifyToken } from '../../utils/generateToken';
import configs from '../../configs';
import uploadCloud from '../../utils/cloudinary';

// get all users
const getUsers = async () => {
    const users = await prisma.user.findMany({
        where: {
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
                }
            }
        }
    });
    const count = await prisma.user.count({
        where: {
            isDeleted: false
        }
    });

    return {
        count,
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
            user: true
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

    const updateuserInfo = await prisma.$transaction(async (tClient) => {
        const updateData = await tClient.user.update({
            where: {
                id: isAccountExist?.user?.id
            },
            data: req.body,
            include: {
                account: true
            }
        });

        await tClient.account.update({
            where: {
                email
            },
            data: {
                isCompleteProfile: true
            }
        });
        return updateData;
    });
    return updateuserInfo;
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
