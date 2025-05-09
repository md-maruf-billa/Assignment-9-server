"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFound = (req, res, next) => {
    console.log(`Not Found: ${req.method} ${req === null || req === void 0 ? void 0 : req.originalUrl}`);
    res.status(404).json({
        message: 'Route not found',
        success: false,
        error: '',
    });
};
exports.default = notFound;
