
import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { paymentService } from "./payment.service";


const initiatePayment = catchAsyncResponse(async (req, res) => {
    const result = await paymentService.initPayment(req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment initate successfully!",
        data: result,
    })
});


const validatePayment = catchAsyncResponse(async (req, res) => {
    const result = await paymentService.validatePayment(req.query);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment validate successfully!",
        data: result,
    })
});


export const paymentController = {
    initiatePayment,
    validatePayment
};