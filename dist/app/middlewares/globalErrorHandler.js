"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../utils/AppError");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode | http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || 'Something went wrong!';
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        message = 'Validation Error';
        error = err.message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = 'Duplicate Key error';
            error = err.meta;
        }
    }
    else if (err instanceof AppError_1.AppError) {
        message = err === null || err === void 0 ? void 0 : err.message;
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        error = err === null || err === void 0 ? void 0 : err.stack;
    }
    res.status(statusCode).json({
        success,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
