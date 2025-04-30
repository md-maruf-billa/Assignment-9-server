import { Router } from 'express';
import { authRouter } from '../modules/Auth/auth.route';
import companyRoute from '../modules/Company/company.route';
import { reviewRouter } from '../modules/Review/review.route';
import { categoryRouter } from '../modules/Category/category.routes';

const appRouter = Router();

const moduleRoutes = [
  { path: '/auth', route: authRouter },
  { path: '/company', route: companyRoute },
  { path: '/review', route: reviewRouter },
  { path: '/category', route: categoryRouter },
];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
