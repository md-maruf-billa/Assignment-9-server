"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.company_controllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const pickQuery_1 = __importDefault(require("../../utils/pickQuery"));
const company_constant_1 = require("./company.constant");
const company_service_1 = require("./company.service");
const http_status_1 = __importDefault(require("http-status"));
const get_all_companies = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pickQuery_1.default)(req.query, company_constant_1.companyFilterableFields);
    const options = (0, pickQuery_1.default)(req.query, company_constant_1.companyPaginationFields);
    const result = yield company_service_1.company_services.get_all_companies_from_db(filters, options);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Companies data fetched successful.",
        meta: result.meta,
        data: result.data,
    });
}));
const get_specific_company = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield company_service_1.company_services.get_specific_company_from_db(id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Company data fetched successful.",
        data: result
    });
}));
const update_company_info = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield company_service_1.company_services.update_company_info_into_db(req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Company information updated successful.",
        data: result
    });
}));
const delete_account = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    yield company_service_1.company_services.delete_account_into_db(email);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Account deleted successful.",
        data: null
    });
}));
exports.company_controllers = {
    get_all_companies,
    get_specific_company,
    update_company_info,
    delete_account
};
