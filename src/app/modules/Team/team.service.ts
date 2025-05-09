import { Request } from "express";
import { prisma } from "../../utils/Prisma";
import uploadCloud from "../../utils/cloudinary";
import { AppError } from "../../utils/AppError";
import status from "http-status";

const create_new_team_member_into_db = async (req: Request) => {
    if (req.file) {
        const uploadImage = await uploadCloud(req?.file)
        req.body.profileImage = uploadImage?.secure_url;
    }
    const result = await prisma.team.create({
        data: req?.body
    })
    return result;
}

const get_all_team_member_from_db = async () => {
    const result = await prisma.team.findMany();
    return result;
}
const get_unique_team_member_from_db = async (id: string) => {
    const result = await prisma.team.findUnique({ where: { id } });
    if (!result) {
        throw new AppError("Team member not found !", status.NOT_FOUND)
    }
    return result;
}
const delete_team_member_from_db = async (id: string) => {
    const result = await prisma.team.findUnique({ where: { id } });
    if (!result) {
        throw new AppError("Team member not found !", status.NOT_FOUND)
    }
    await prisma.team.delete({
        where: { id }
    })
    return "Team member deleted .";
}

const update_team_member_into_db = async (req: Request) => {
    const { id } = req?.params;
    const isMemberExist = await prisma.team.findUnique({ where: { id } })
    if (!isMemberExist) {
        throw new AppError("Team member not found !", status.NOT_FOUND)
    }
    if (req.file) {
        const uploadImage = await uploadCloud(req?.file)
        req.body.profileImage = uploadImage?.secure_url;
    }
    const result = await prisma.team.update({
        where: { id },
        data: req?.body
    })
    return result;
}

export const team_services = {
    create_new_team_member_into_db,
    get_all_team_member_from_db,
    get_unique_team_member_from_db,
    update_team_member_into_db,
    delete_team_member_from_db
}