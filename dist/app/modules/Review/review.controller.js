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
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const review_service_1 = require("./review.service");
const pickQuery_1 = __importDefault(require("../../utils/pickQuery"));
const review_constant_1 = require("./review.constant");
const getReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pickQuery_1.default)(req.query, review_constant_1.reviewFilterableFields);
    const options = (0, pickQuery_1.default)(req.query, review_constant_1.reviewPaginationFields);
    const result = yield review_service_1.reviewService.getReview(filters, options);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews fetched successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const getSingleReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getSingleReview(req.params.id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review fetched successfully',
        data: result,
    });
}));
const getReviewByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getReviewByUserId(req.params.userId);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews fetched successfully by user ID',
        data: result,
    });
}));
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const result = yield review_service_1.reviewService.createReview(req.body, email);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req === null || req === void 0 ? void 0 : req.query;
    const result = yield review_service_1.reviewService.updateReview(req.body, reviewId, userId);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review Updated successfully',
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req === null || req === void 0 ? void 0 : req.query;
    yield review_service_1.reviewService.deleteReview(reviewId, userId);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review deleted successfully (soft delete)',
        data: null,
    });
}));
const getAllPremiumReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getAllPremiumReview();
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All premium reviews fetched successfully',
        data: result,
    });
}));
exports.reviewController = {
    createReview,
    updateReview,
    deleteReview,
    getReview,
    getSingleReview,
    getReviewByUserId,
    getAllPremiumReview,
};
