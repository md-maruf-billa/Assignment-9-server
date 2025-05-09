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
exports.AuthController = void 0;
const configs_1 = __importDefault(require("../../configs"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const auth_services_1 = require("./auth.services");
const http_status_1 = __importDefault(require("http-status"));
const register_user = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthService.register_user_into_db(req === null || req === void 0 ? void 0 : req.body);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User registered successfully!',
        data: result,
    });
}));
const login_user = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.AuthService.login_user_from_db(req.body);
    res.cookie('refreshToken', result.refreshToken, {
        secure: configs_1.default.env == 'production',
        httpOnly: true,
    });
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in successful !',
        data: {
            accessToken: result.accessToken,
        },
    });
}));
const get_my_profile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield auth_services_1.AuthService.get_my_profile_from_db(email);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile fetched successfully!',
        data: result,
    });
}));
const refresh_token = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_services_1.AuthService.refresh_token_from_db(refreshToken);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Refresh token generated successfully!',
        data: result,
    });
}));
const change_password = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const result = yield auth_services_1.AuthService.change_password_from_db(user, req.body);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password changed successfully!',
        data: result,
    });
}));
const forget_password = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.body;
    yield auth_services_1.AuthService.forget_password_from_db(email);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reset password link sent to your email!',
        data: null,
    });
}));
const reset_password = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword, email } = req.body;
    const result = yield auth_services_1.AuthService.reset_password_into_db(token, email, newPassword);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset successfully!',
        data: result,
    });
}));
exports.AuthController = {
    register_user,
    get_my_profile,
    login_user,
    refresh_token,
    change_password,
    forget_password,
    reset_password,
};
