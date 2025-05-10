"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const company_route_1 = __importDefault(require("../modules/Company/company.route"));
const review_route_1 = __importDefault(require("../modules/Review/review.route"));
const category_routes_1 = require("../modules/Category/category.routes");
const product_route_1 = require("../modules/Products/product.route");
const user_route_1 = require("../modules/User/user.route");
const comment_route_1 = require("../modules/CommentReview/comment.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const team_route_1 = __importDefault(require("../modules/Team/team.route"));
const appRouter = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/auth', route: auth_route_1.authRouter },
    { path: '/company', route: company_route_1.default },
    { path: '/review', route: review_route_1.default },
    { path: '/category', route: category_routes_1.categoryRouter },
    { path: '/product', route: product_route_1.productRouters },
    { path: '/user', route: user_route_1.userRouters },
    { path: '/comment', route: comment_route_1.commentRouters },
    { path: '/payment', route: payment_route_1.paymentRoutes },
    { path: "/team", route: team_route_1.default }
];
moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
exports.default = appRouter;
