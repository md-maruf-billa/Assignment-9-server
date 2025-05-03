import { prisma } from '../../utils/Prisma';


const getUsers = async () => {
    return await prisma.user.findMany({
        where: {
            isdeleted: false
        },

    });
};

const getUserById = async (id: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id,
            isDeleted: false
        },
    });
};


const updateUser = async (id: string, data: any) => {
    return await prisma.user.update({
        where: { id },
        data,
    });
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
