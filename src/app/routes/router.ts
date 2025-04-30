import { Router } from 'express';
import { authRouter } from '../modules/Auth/auth.route';
import { reviewRouter } from '../modules/Review/review.route';

const appRouter = Router();

const moduleRoutes = [
  { path: '/auth', route: authRouter },
  { path: '/review', route: reviewRouter },
];


moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
