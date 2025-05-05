import { Router } from 'express';
import { authRouter } from '../modules/Auth/auth.route';
import companyRoute from '../modules/Company/company.route';
import reviewRouter from '../modules/Review/review.route';
import { categoryRouter } from '../modules/Category/category.routes';
import { productRouters } from '../modules/Products/product.route';
import { userRouters } from '../modules/User/user.route';
import { commentRouters } from '../modules/CommentReview/comment.route';

const appRouter = Router();

const moduleRoutes = [
  { path: '/auth', route: authRouter },
  { path: '/company', route: companyRoute },
  { path: '/review', route: reviewRouter },
  { path: '/category', route: categoryRouter },
  { path: '/product', route: productRouters },
  { path: '/user', route: userRouters },
  { path: '/comment', route: commentRouters },
];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
