import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { userService } from "./user.service";
import pickQuery from "../../utils/pickQuery";
import { userFilterableFields, userPaginationFields } from "./user.constant";

// get all users
const getUsers = catchAsyncResponse(async (
    req,
    res
) => {

    const filters = pickQuery(req.query, userFilterableFields);
    const options = pickQuery(req.query, userPaginationFields);

    const result = await userService.getUsers(filters, options);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User retrieved successfully',
        meta: result.meta,
        data: result.users,
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
    const { email } = req.user;
    const result = await userService.updateUser(email, req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});


// delete user
const deleteUser = catchAsyncResponse(async (
    req,
    res
) => {
    const { email } = req.user;
    const result = await userService.deleteUserFromDB(email);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});


export const userController = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};