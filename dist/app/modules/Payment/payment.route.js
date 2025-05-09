"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/', payment_controller_1.paymentController.getAllPayment);
router.get('/ipn', payment_controller_1.paymentController.validatePayment);
router.post('/initiate-payment', (0, auth_1.default)('USER'), payment_controller_1.paymentController.initiatePayment);
exports.paymentRoutes = router;
