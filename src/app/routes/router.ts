import { Router } from 'express';
import { authRouter } from '../modules/Auth/auth.route';
import companyRoute from '../modules/Company/company.route';

const appRouter = Router();

const moduleRoutes = [
  { path: '/auth', route: authRouter },
  { path: "/company", route: companyRoute }
];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
