import catchAsyncResponse from "../../utils/catchAsync"
import manageResponse from "../../utils/manageRes";
import { company_services } from "./company.service"
import httpStatus from 'http-status';

const get_all_companies = catchAsyncResponse(async (req, res) => {
    const result = await company_services.get_all_companies_from_db();
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Companies data fetched successful.",
        data: result
    })
})

const get_specific_company = catchAsyncResponse(async (req, res) => {
    const { id } = req?.params;
    const result = await company_services.get_specific_company_from_db(id as string)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Company data fetched successful.",
        data: result
    })
})

const update_company_info = catchAsyncResponse(async (req, res) => {
    const { id } = req?.params;
    const result = await company_services.update_company_info_into_db(id, req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Company information updated successful.",
        data: result
    })
})

export const company_controllers = {
    get_all_companies,
    get_specific_company,
    update_company_info
}