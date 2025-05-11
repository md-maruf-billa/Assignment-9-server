import { NextFunction, Request, Response, Router } from 'express';
import { userController } from './user.controller';
import uploader from '../../middlewares/uploader';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', userController.getUsers);

router.get('/:id', userController.getUserById);

router.patch(
  '/',
  auth('USER', "ADMIN"),
  uploader.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.updateUser.parse(JSON.parse(req.body.data));
    userController.updateUser(req, res, next);
  },
);

router.delete('/', auth('USER'), userController.deleteUser);

export const userRouters = router;
