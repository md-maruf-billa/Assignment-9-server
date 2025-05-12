import axios from "axios";
import httpStatus, { status } from "http-status";
import { IPaymentData } from "./ssl.interface";
import configs from "../../configs";
import { AppError } from "../../utils/AppError";
import SSLCommerzPayment from "sslcommerz-lts";

const initPayment = async (paymentData: IPaymentData) => {

    const store_id = configs.ssl.storeId;
    const store_passwd = configs.ssl.storePass;
    const is_live = false;

    try {
        const data = {
            store_id: configs.ssl.storeId,
            store_passwd: configs.ssl.storePass,
            total_amount: paymentData.amount,
            currency: 'BDT',
            tran_id: paymentData.transactionId,

            success_url: configs.clientSite_url + `/api/payment/webhook`,
            fail_url: configs.clientSite_url + '/payment/fail',
            cancel_url: configs.clientSite_url + 'payment/cancel',
            ipn_url: configs.clientSite_url + '/ipn',

            shipping_method: 'N/A',
            product_name: 'Appointment',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address,
            cus_add2: 'N/A',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: paymentData.phoneNumber,
            cus_fax: '01711111111',
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'N/A',
        };


        const sslcz: any = new SSLCommerzPayment(
            store_id as string,
            store_passwd as string,
            is_live
        );
        const apiResponse = await sslcz.init(data);
        if (!apiResponse?.GatewayPageURL) {
            throw new AppError(
                'Failed to get payment gateway URL',
                httpStatus.BAD_REQUEST
            );
        }
        return { GatewayPageURL: apiResponse.GatewayPageURL };
    }
    catch (err) {
        throw new AppError(
            "Payment erro occured!",
            status.BAD_REQUEST,
        )
    }
};


const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${configs.ssl.sslValidateUrl}?val_id=${payload.val_id}&store_id=${configs.ssl.storeId}&store_passwd=${configs.ssl.storePass}&format=json`
        });
        return response.data;
    }
    catch (err: any) {
        throw new AppError(
            "Payment validation failed!",
            httpStatus.BAD_REQUEST,
        );
    }
};

export const SSLService = {
    initPayment,
    validatePayment
};