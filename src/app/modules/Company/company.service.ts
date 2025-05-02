import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/Prisma"
import httpStatus from 'http-status';
import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";

const get_all_companies_from_db = async () => {
    const result = await prisma.company.findMany({
        include: {
            account: true
        }
    })
    return result;
}

const get_specific_company_from_db = async (id: string) => {
    const result = await prisma.company.findUnique({ where: { id }, include: { account: true } })
    if (!result) {
        throw new AppError("Company not found !", httpStatus.NOT_FOUND)
    }
    return result;
}
const update_company_info_into_db = async (id: string, req: Request) => {
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

const delete_account_into_db = async (id: string) => {
    const isExistAccount = await prisma.account.findUnique({ where: { id } })
    if (!isExistAccount) {
        throw new AppError("Account not found !!", httpStatus.NOT_FOUND)
    }
    await prisma.account.update({ where: { id }, data: { isDeleted: true } })
    return;
}

export const company_services = {
    get_all_companies_from_db,
    get_specific_company_from_db,
    update_company_info_into_db,
    delete_account_into_db
}