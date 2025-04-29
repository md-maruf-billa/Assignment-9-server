// import { Router } from "express";
import authRouter from "./app/modules/Auth/auth.route";

const appRouter = Router();

const moduleRoutes = [{ path: "/auth", route: authRouter }];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;
