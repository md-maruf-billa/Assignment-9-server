import { Request } from "express";
import { prisma } from "../../utils/Prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";

const initPayment = async (req: Request) => {

    const userAccount = await prisma.account.findUniqueOrThrow({
        where: {
            email: req.user.email
        },
        include: {
            user: true,
        }
    });

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
    if (!payload || !payload.status || !(payload.status === 'VALID')) {
        return {
            message: "Invalid Payment!"
        }
    }

    const response1 = await SSLService.validatePayment(payload);
    if (response1?.status !== 'VALID') {
        return {
            message: "Payment Failed!"
        }
    }

    const response = payload;

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
        })
    });

    return {
        message: "Payment success!"
    }
};


export const paymentService = {
    initPayment,
    validatePayment
};