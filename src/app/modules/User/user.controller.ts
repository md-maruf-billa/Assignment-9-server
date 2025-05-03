import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { userService } from "./user.service";

// get all users
const getUsers = catchAsyncResponse(async (
    req,
    res
) => {
    const result = await userService.getUsers();
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});


// find by id
const getUserById = catchAsyncResponse(async (
    req,
    res
) => {
    const { id } = req.params;
    const result = await userService.getUserById(id);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});


// update user
const updateUser = catchAsyncResponse(async (
    req,
    res
) => {
    const { id } = req.params;
    const result = await userService.updateUser(id, req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

export const userController = {
    getUsers,
    getUserById,
    updateUser,
};