import { Request } from "express";
import { prisma } from "../../utils/Prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError";
import status from "http-status";

const initPayment = async (req: Request) => {

    const userAccount = await prisma.account.findUnique({
        where: {
            email: req.user.email,
        },
        include: {
            user: true,
        }
    });

    if (!userAccount) {
        throw new AppError(
            'User not found',
            status.BAD_REQUEST
        );
    }
    if (userAccount.isPremium) {
        throw new AppError(
            'User is already premium',
            status.BAD_REQUEST
        );
    }

    const transactionId = `premium-${Date.now()}`;
    await prisma.payment.create({
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
        name: userAccount.user?.name ?? 'USER',
        email: userAccount.email,
        address: 'N/A',
        phoneNumber: '01711111111',
    };

    const result = await SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result.GatewayPageURL
    };
};

// validate payment
const validatePayment = async (query: any) => {

    if (!query?.tran_id) {
        throw new AppError('Missing transaction ID', status.BAD_REQUEST);
    };

    const payment = await prisma.payment.findUnique({
        where: {
            transactionId: query.tran_id
        }
    });

    if (!payment) {
        throw new AppError(
            'Payment not found',
            status.BAD_REQUEST
        );
    };

    // const isPaid = await prisma.payment.findFirst({
    //     where: {
    //         transactionId: query.tran_id,
    //         status: PaymentStatus.PAID
    //     }
    // });
    // if (isPaid) {
    //     throw new AppError(
    //         'Already paid',
    //         status.BAD_REQUEST
    //     );
    // };


    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: query.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: query
            }
        });

        await tx.account.update({
            where: {
                id: updatedPaymentData.accountId
            },
            data: {
                isPremium: true
            }
        });
    });

    return {
        message: "Payment success!"
    }
};


const getAllPayment = async () => {
    const payments = await prisma.payment.findMany({
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
};


const getMyPayment = async (req: Request) => {

    const userAccount = await prisma.account.findUnique({
        where: {
            email: req.user.email,
            isDeleted: false,
        },
        include: {
            user: true,
        }
    });

    const payments = await prisma.payment.findMany({
        where: {
            accountId: userAccount?.id,
            isDeleted: false,
            status: "PAID"
        },
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

    return payments
};



export const paymentService = {
    initPayment,
    validatePayment,
    getAllPayment,
    getMyPayment
};