import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/generateToken';
import configs from '../configs';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';


const auth = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError('You are not authorize!!', 401);
      }
      const verifiedUser = verifyToken(
        token,
        configs.jwt.access_secret as string,
      );
      if (!roles.length || !roles.includes(verifiedUser.role)) {
        throw new AppError('You are not authorize!!', 401);
      }
      req.user = verifiedUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
