
import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { paymentService } from "./payment.service";


const initiatePayment = catchAsyncResponse(async (req, res) => {
    const result = await paymentService.initPayment(req);
    manageResponse(res, {
        statusCode: status.CREATED,
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


const getAllPayment = catchAsyncResponse(async (req, res) => {
    const result = await paymentService.getAllPayment();
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payments fetched successfully!",
        data: result,
    })
});


const getMyPayment = catchAsyncResponse(async (req, res) => {
    const result = await paymentService.getMyPayment(req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My Payments fetched successfully!",
        data: result,
    })
});



export const paymentController = {
    initiatePayment,
    validatePayment,
    getAllPayment,
    getMyPayment
};