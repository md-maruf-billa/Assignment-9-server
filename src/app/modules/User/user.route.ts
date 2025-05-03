import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.get(
    '/',
    userController.getUsers
);

router.get(
    '/:id',
    userController.getUserById
);

router.patch(
    '/update/:id',
    userController.updateUser
);


export const userRouters = router;