import catchAsyncResponse from "../../utils/catchAsync"
import manageResponse from "../../utils/manageRes";
import pickQuery from "../../utils/pickQuery";
import { companyFilterableFields, companyPaginationFields } from "./company.constant";
import { company_services } from "./company.service"
import httpStatus from 'http-status';

const get_all_companies = catchAsyncResponse(async (req, res) => {

    const filters = pickQuery(req.query, companyFilterableFields);
    const options = pickQuery(req.query, companyPaginationFields);

    const result = await company_services.get_all_companies_from_db(filters, options);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Companies data fetched successful.",
        meta: result.meta,
        data: result.data,
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
    const result = await company_services.update_company_info_into_db(req)
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Company information updated successful.",
        data: result
    })
})


const delete_account = catchAsyncResponse(async (req, res) => {
    const { email } = req.user;
    await company_services.delete_account_into_db(email as string);
    manageResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Account deleted successful.",
        data: null
    })
})

export const company_controllers = {
    get_all_companies,
    get_specific_company,
    update_company_info,
    delete_account
}