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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Prisma_1 = require("../../utils/Prisma");
const http_status_1 = __importDefault(require("http-status"));
const JWT_1 = require("../../utils/JWT");
const configs_1 = __importDefault(require("../../configs"));
const emailSender_1 = require("../../utils/emailSender");
const AppError_1 = require("./../../utils/AppError");
const register_user_into_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.email || !payload.password) {
        throw new AppError_1.AppError('Email and password are required', http_status_1.default.BAD_REQUEST);
    }
    if (!payload.role) {
        throw new AppError_1.AppError('Role is required', http_status_1.default.BAD_REQUEST);
    }
    const isAccountExists = yield Prisma_1.prisma.account.findUnique({
        where: { email: payload.email },
    });
    if (isAccountExists) {
        throw new AppError_1.AppError('Account already exists', http_status_1.default.BAD_REQUEST);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
        throw new AppError_1.AppError('Invalid email format', http_status_1.default.BAD_REQUEST);
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const accountData = {
        email: payload.email,
        password: hashedPassword,
        role: payload.role.toUpperCase(),
    };
    const result = yield Prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdAccount = yield tx.account.create({ data: accountData });
        if (payload.role === 'COMPANY') {
            yield tx.company.create({
                data: {
                    accountId: createdAccount.id,
                    name: payload.name
                }
            });
        }
        if (payload.role === 'USER') {
            yield tx.user.create({ data: { accountId: createdAccount.id, name: payload.name } });
        }
        if (payload.role === 'ADMIN') {
            yield tx.admin.create({ data: { accountId: createdAccount.id, name: payload.name } });
        }
        const finalUser = yield tx.account.findUnique({
            where: { email: payload.email },
            include: {
                company: true,
                user: true,
                admin: true,
            },
        });
        (0, emailSender_1.EmailSender)(createdAccount.email, "Welcome to ReviewHub – Account Successfully Created", `
        <p>Hi there,</p>
    
        <p>Thank you for signing up! Your account has been successfully created and you're now ready to explore all that ReviewHub has to offer.</p>
      `);
        return finalUser;
    }));
    return result;
});
const login_user_from_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield Prisma_1.prisma.account.findUnique({
        where: { email: payload.email, status: 'ACTIVE', isDeleted: false },
        include: {
            company: true,
            user: true,
            admin: true,
        },
    });
    if (!isUserExists) {
        throw new AppError_1.AppError('Account not found', http_status_1.default.NOT_FOUND);
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, isUserExists.password);
    if (!isPasswordMatch) {
        throw new AppError_1.AppError('Invalid password', http_status_1.default.UNAUTHORIZED);
    }
    const { password } = isUserExists, userData = __rest(isUserExists, ["password"]);
    const accessToken = JWT_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, configs_1.default.jwt.access_secret, configs_1.default.jwt.access_expires);
    const refreshToken = JWT_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, configs_1.default.jwt.refresh_secret, configs_1.default.jwt.refresh_expires);
    (0, emailSender_1.EmailSender)(isUserExists.email, "Successfully login !!!", `<p>You are successfully login your account. If this wasn't you, please 
        <a href="${configs_1.default.jwt.reset_base_link}" style="color: #1a73e8;">reset your password</a> immediately.
    </p>`);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
});
const get_my_profile_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Prisma_1.prisma.account.findUnique({
        where: { email: email, isDeleted: false, status: "ACTIVE" },
        select: {
            id: true,
            status: true,
            email: true,
            role: true,
            isCompleteProfile: true,
            user: true,
            admin: true,
            company: true,
            createdAt: true
        }
    });
    if (!user) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    return user;
});
const refresh_token_from_db = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.default.jwt.refresh_secret);
    }
    catch (err) {
        throw new Error('You are not authorized!');
    }
    const userData = yield Prisma_1.prisma.account.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            isDeleted: false,
            status: "ACTIVE"
        },
    });
    const accessToken = JWT_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, configs_1.default.jwt.access_secret, configs_1.default.jwt.access_expires);
    return accessToken;
});
const change_password_from_db = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date().toLocaleString();
    const isExistAccount = yield Prisma_1.prisma.account.findUnique({
        where: {
            email: user.email,
            isDeleted: false,
            status: 'ACTIVE',
        },
    });
    if (!isExistAccount) {
        throw new AppError_1.AppError('Account not found !', http_status_1.default.NOT_FOUND);
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, isExistAccount.password);
    if (!isCorrectPassword) {
        throw new AppError_1.AppError('Old password is incorrect', http_status_1.default.UNAUTHORIZED);
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield Prisma_1.prisma.account.update({
        where: {
            email: isExistAccount.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    yield (0, emailSender_1.EmailSender)(isExistAccount.email, "Your Password Changed !!", `<div style="font-family: Arial, sans-serif;">
      <h4>Password Change Notification</h4>
      <p>Your password was changed on <strong>${today}</strong>.</p>
      <p>If this wasn't you, please 
        <a href="${configs_1.default.jwt.reset_base_link}" style="color: #1a73e8;">reset your password</a> immediately.
      </p>
    </div>`);
    return 'Password update is successful.';
});
const forget_password_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExists = yield Prisma_1.prisma.account.findUnique({
        where: {
            email: email,
            isDeleted: false,
            status: 'ACTIVE',
        },
    });
    if (!isAccountExists) {
        throw new AppError_1.AppError('Account not found', 404);
    }
    const resetToken = JWT_1.jwtHelpers.generateToken({
        email: isAccountExists.email,
        role: isAccountExists.role,
    }, configs_1.default.jwt.reset_secret, configs_1.default.jwt.reset_expires);
    const resetPasswordLink = `${configs_1.default.jwt.reset_base_link}?token=${resetToken}&email=${isAccountExists.email}`;
    const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;
    yield (0, emailSender_1.EmailSender)(email, 'Reset Password Link', emailTemplate);
    return 'Reset password link sent to your email!';
});
const reset_password_into_db = (token, email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.default.jwt.reset_secret);
    }
    catch (err) {
        throw new AppError_1.AppError('Your reset link is expire. Submit new link request!!', http_status_1.default.UNAUTHORIZED);
    }
    const isAccountExists = yield Prisma_1.prisma.account.findUnique({
        where: {
            email: decodedData.email,
            isDeleted: false,
            status: 'ACTIVE',
        },
    });
    if (!isAccountExists) {
        throw new AppError_1.AppError('Account not found!!', http_status_1.default.NOT_FOUND);
    }
    if (isAccountExists.email !== email) {
        throw new AppError_1.AppError('Invalid email', http_status_1.default.UNAUTHORIZED);
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield Prisma_1.prisma.account.update({
        where: {
            email: isAccountExists.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    (0, emailSender_1.EmailSender)(isAccountExists.email, "Password Reset Successful.", `<p>Your password is successfully reset now you can login with using your password</p>`);
    return 'Password reset successfully!';
});
exports.AuthService = {
    register_user_into_db,
    login_user_from_db,
    get_my_profile_from_db,
    refresh_token_from_db,
    change_password_from_db,
    forget_password_from_db,
    reset_password_into_db,
};
