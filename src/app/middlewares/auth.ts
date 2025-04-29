import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/generateToken";
import config from "../config";
import AppError from "../errors/appError";

const auth = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                throw new AppError(401, "You are not authorize!!")
            }
            const verifiedUser = verifyToken(token, config.jwt.access_secret as string)
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new AppError(401, "You are not authorize!!")
            }
            req.user = verifiedUser;
            next()
        } catch (err) {
            next(err)
        }
    }
}

export default auth;