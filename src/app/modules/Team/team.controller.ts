import status from "http-status";
import catchAsyncResponse from "../../utils/catchAsync";
import manageResponse from "../../utils/manageRes";
import { team_services } from "./team.service";

const create_new_team = catchAsyncResponse(async (req, res) => {
    const result = await team_services.create_new_team_member_into_db(req);
    manageResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: "Team member added successful.",
        data: result
    })
})

const get_all_team_member = catchAsyncResponse(async (req, res) => {
    const result = await team_services.get_all_team_member_from_db()
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team member data fetched.",
        data: result
    })
})
const get_unique_team_member = catchAsyncResponse(async (req, res) => {
    const { id } = req.params;
    const result = await team_services.get_unique_team_member_from_db(id)
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team member data fetched.",
        data: result
    })
})
const update_team_member = catchAsyncResponse(async (req, res) => {
    const result = await team_services.update_team_member_into_db(req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team member update successful.",
        data: result
    })
})
const delete_team_member = catchAsyncResponse(async (req, res) => {
    const { id } = req?.params
    const result = await team_services.delete_team_member_from_db(id);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Team member deleted successful.",
        data: result
    })
})

export const team_controllers = {
    create_new_team,
    get_all_team_member,
    get_unique_team_member,
    update_team_member,
    delete_team_member
}