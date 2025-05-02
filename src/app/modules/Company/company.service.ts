import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/Prisma"
import httpStatus from 'http-status';
import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";

const get_all_companies_from_db = async () => {
    const result = await prisma.company.findMany({
        where: {
            isDeleted: false
        },
        include: {
            account: true
        }
    })
    return result;
}

const get_specific_company_from_db = async (id: string) => {
    const result = await prisma.company.findUnique({ where: { id, isDeleted: false }, include: { account: true } })
    if (!result) {
        throw new AppError("Company not found !", httpStatus.NOT_FOUND)
    }
    return result;
}
const update_company_info_into_db = async (id: string, req: Request) => {
    // find first account
    const isAccountExist = await prisma.account.findUnique({ where: { email: req?.user?.email }, include: { company: true } })
    if (!isAccountExist || isAccountExist.company?.id !== id) {
        throw new AppError("You are not authorized !!", httpStatus.UNAUTHORIZED)
    }
    const isExistCompany = await prisma.company.findUnique({ where: { id } })
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