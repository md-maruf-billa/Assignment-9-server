import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";


const router = Router();

router.get(
    '/',
    paymentController.getAllPayment
);

router.get(
    '/validate-payment',
    paymentController.validatePayment
);

router.post(
    '/initiate-payment',
    auth('USER'),
    paymentController.initiatePayment
);

router.get(
    '/my-payment',
    auth('USER'),
    paymentController.getMyPayment
)

export const paymentRoutes = router;