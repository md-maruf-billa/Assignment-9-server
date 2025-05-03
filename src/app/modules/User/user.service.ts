import status from 'http-status';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../utils/Prisma';

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
    id: string,
    data: any
) => {

    const user = await prisma.user.findUnique({
        where: {
            id,
            isDeleted: false
        },
    });
    if (!user) {
        throw new AppError(
            'User not found',
            status.NOT_FOUND
        );
    };


};

const deleteUser = async (id: string) => {
    // return await prisma.user.update({
    //     where: { id },
    //     data: {
    //         isDeleted: true
    //     }

    // });
};


export const userService = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
