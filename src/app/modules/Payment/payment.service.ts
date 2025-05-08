import { Request } from "express";
import configs from "../../configs";
import { prisma } from "../../utils/Prisma";

const initPayment = async (req: Request) => {

    const user = await prisma.account.findUniqueOrThrow({
        where: {
            email: req.user.email
        }
    });

    return user

    // const data = {
    //     store_id: configs.ssl.storeId,
    //     store_passwd: configs.ssl.storePass,
    //     // total_amount: paymentData.amount,
    //     currency: 'USD',
    //     // tran_id: paymentData.transactionId, // use unique tran_id for each api call
    //     success_url: configs.ssl.successUrl,
    //     fail_url: configs.ssl.failUrl,
    //     cancel_url: configs.ssl.cancelUrl,
    //     ipn_url: 'http://localhost:3030/ipn',
    //     shipping_method: 'N/A',
    //     product_name: 'Appointment',
    //     product_category: 'Service',
    //     product_profile: 'general',
    //     // cus_name: paymentData.name,
    //     // cus_email: paymentData.email,
    //     // cus_add1: paymentData.address,
    //     cus_add2: 'N/A',
    //     cus_city: 'Dhaka',
    //     cus_state: 'Dhaka',
    //     cus_postcode: '1000',
    //     cus_country: 'Bangladesh',
    //     // cus_phone: paymentData.phoneNumber,
    //     cus_fax: '01711111111',
    //     ship_name: 'N/A',
    //     ship_add1: 'N/A',
    //     ship_add2: 'N/A',
    //     ship_city: 'N/A',
    //     ship_state: 'N/A',
    //     ship_postcode: 1000,
    //     ship_country: 'N/A',
    // };

}


export const paymentService = {
    initPayment,
};