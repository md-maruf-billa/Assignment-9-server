"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (error) => {
    // Extract the field causing the error using a regex
    const pathMatch = error.message.match(/path "([^"]*)"/);
    const path = pathMatch ? pathMatch[1] : 'unknown';
    // Extract additional message details if available
    const match = error.message.match(/"([^"]*)"/);
    const extractMessage = match ? match[1] : 'Unknown value';
    // Construct error sources array
    const errorSources = [
        {
            path, // The extracted path
            message: `${extractMessage} already exists`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Duplicate key error',
        errorSources,
    };
};
exports.handleDuplicateError = handleDuplicateError;
