"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodErrorHandler = void 0;
const ZodErrorHandler = (error) => {
    const statusCode = 400;
    const errorSources = error.issues.map((issue) => {
        var _a;
        return ({
            path: ((_a = issue.path[issue.path.length - 1]) === null || _a === void 0 ? void 0 : _a.toString()) || 'unknown',
            message: issue.message,
        });
    });
    return {
        statusCode,
        message: 'Validation error',
        errorSources,
    };
};
exports.ZodErrorHandler = ZodErrorHandler;
