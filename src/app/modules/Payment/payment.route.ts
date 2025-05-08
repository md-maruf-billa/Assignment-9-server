import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";


const router = Router();


router.get(
    '/ipn',
    paymentController.validatePayment
);

router.post(
    '/initiate-payment',
    auth('USER'),
    paymentController.initiatePayment
);

export const paymentRoutes = router;