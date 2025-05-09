"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./app/routes/router"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['*', 'http://localhost:3001'],
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// routes
app.use('/api', router_1.default);
// stating point
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the API!',
        data: null,
    });
});
// global error handler
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
