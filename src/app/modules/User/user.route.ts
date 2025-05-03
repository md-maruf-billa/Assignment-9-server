import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.get(
    '/',
    userController.getUsers
);


export const userRouters = router;