"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateToken_1 = require("../utils/generateToken");
const configs_1 = __importDefault(require("../configs"));
const AppError_1 = require("../utils/AppError");
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.AppError('You are not authorize!!', 401);
            }
            const verifiedUser = (0, generateToken_1.verifyToken)(token, configs_1.default.jwt.access_secret);
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new AppError_1.AppError('You are not authorize!!', 401);
            }
            req.user = verifiedUser;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
