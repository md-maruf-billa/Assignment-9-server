"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const Prisma_1 = require("../../utils/Prisma");
const ssl_service_1 = require("../SSL/ssl.service");
const client_1 = require("@prisma/client");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const initPayment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userAccount = yield Prisma_1.prisma.account.findUnique({
        where: {
            email: req.user.email,
        },
        include: {
            user: true,
        }
    });
    if (!userAccount) {
        throw new AppError_1.AppError('User not found', http_status_1.default.BAD_REQUEST);
    }
    if (userAccount.isPremium) {
        throw new AppError_1.AppError('User is already premium', http_status_1.default.BAD_REQUEST);
    }
    const transactionId = `premium-${Date.now()}`;
    yield Prisma_1.prisma.payment.create({
        data: {
            accountId: userAccount.id,
            transactionId,
            amount: 29,
            status: 'UNPAID',
        },
    });
    const initPaymentData = {
        amount: 29,
        transactionId,
        name: (_b = (_a = userAccount.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'USER',
        email: userAccount.email,
        address: 'N/A',
        phoneNumber: '01711111111',
    };
    const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result.GatewayPageURL
    };
    // return result;
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.tran_id)) {
        throw new AppError_1.AppError('Missing transaction ID', http_status_1.default.BAD_REQUEST);
    }
    //! this part for production purpose only
    if (!payload || !payload.status || !(payload.status === 'VALID')) {
        return {
            message: "Invalid Payment!"
        };
    }
    const response1 = yield ssl_service_1.SSLService.validatePayment(payload);
    if ((response1 === null || response1 === void 0 ? void 0 : response1.status) !== 'VALID') {
        return {
            message: "Payment Failed!"
        };
    }
    const response = payload; // this part for development purpose only
    yield Prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPaymentData = yield tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: client_1.PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });
        yield tx.account.update({
            where: {
                id: updatedPaymentData.accountId
            },
            data: {
                isPremium: true
            }
        });
    }));
    return {
        message: "Payment success!"
    };
});
const getAllPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield Prisma_1.prisma.payment.findMany({
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isPremium: true,
                }
            },
        }
    });
    return payments;
});
exports.paymentService = {
    initPayment,
    validatePayment,
    getAllPayment
};
