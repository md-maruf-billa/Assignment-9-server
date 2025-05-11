"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.string(),
});
const loginUser = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const getMyProfile = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const changePassword = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6),
    newPassword: zod_1.z.string().min(6),
});
const forgotPassword = zod_1.z.object({
    email: zod_1.z.string(),
});
const resetPassword = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string(),
    email: zod_1.z.string(),
});
const change_status = zod_1.z.object({
    email: zod_1.z.string().optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
});
exports.AuthValidation = {
    registerUser,
    loginUser,
    getMyProfile,
    forgotPassword,
    changePassword,
    resetPassword,
    change_status
};
