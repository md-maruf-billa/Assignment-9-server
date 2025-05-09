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

    // return result;
}

const validatePayment = async (payload: any) => {

    if (!payload?.tran_id) {
        throw new AppError('Missing transaction ID', status.BAD_REQUEST);
    }

    //! this part for production purpose only

    // if (!payload || !payload.status || !(payload.status === 'VALID')) {
    //     return {
    //         message: "Invalid Payment!"
    //     }
    // }

    // const response1 = await SSLService.validatePayment(payload);
    // if (response1?.status !== 'VALID') {
    //     return {
    //         message: "Payment Failed!"
    //     }
    // }

    const response = payload; // this part for development purpose only

    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
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
}

export const paymentService = {
    initPayment,
    validatePayment,
    getAllPayment
};