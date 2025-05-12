import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env') })
export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        access_secret: process.env.ACCESS_SECRET,
        access_expires: process.env.ACCESS_EXPIRES_IN,
        refresh_secret: process.env.REFRESH_SECRET,
        refresh_expires: process.env.REFRESH_EXPIRES_IN,
        reset_secret: process.env.RESET_SECRET,
        reset_expires: process.env.RESET_EXPIRES_IN,
        reset_base_link: process.env.RESET_BASE_LINK
    },
    email_sender: {
        email: process.env.EMAIL,
        password: process.env.APP_PASSWORD
    },
    ssl: {
        storeId: process.env.STORE_ID,
        storePass: process.env.STORE_PASSWORD,
        successUrl: process.env.SUCCESS_URL,
        failUrl: process.env.FAIL_URL,
        cancelUrl: process.env.CANCEL_URL,
        sslPaymentUrl: process.env.SSL_PAYMENT_API,
        sslValidateUrl: process.env.SSL_VALIDATION_API,
    },
    clientSite_url: process.env.FRONTEND_URL,

}