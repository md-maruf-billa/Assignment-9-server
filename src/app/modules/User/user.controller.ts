import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { userService } from "./user.service";


const getUsers = catchAsyncResponse(async (req, res) => {
    const result = await userService.getUsers();
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});

export const userController = {
    getUsers,
};