import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/Prisma"
import httpStatus from 'http-status';

const get_all_companies_from_db = async () => {
    const result = await prisma.company.findMany({
        include: {
            account: true
        }
    })
    return result;
}

const get_specific_company_from_db = async (id: string) => {
    const result = await prisma.company.findUnique({ where: { id } })
    if (!result) {
        throw new AppError("Company not found !", httpStatus.NOT_FOUND)
    }
    return result;
}

export const company_services = {
    get_all_companies_from_db,
    get_specific_company_from_db
}