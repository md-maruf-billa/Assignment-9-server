import { Request } from "express";
import { prisma } from "../../utils/Prisma";
import { SSLService } from "../SSL/ssl.service";

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


export const paymentService = {
    initPayment,
};