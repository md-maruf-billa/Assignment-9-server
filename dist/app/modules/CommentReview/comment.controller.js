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
exports.commentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const comment_service_1 = require("./comment.service");
const getComments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.commentService.getAllComments();
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comments fetched successfully',
        data: result,
    });
}));
const getSingleComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.commentService.getSingleComment(req.params.id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single comment fetched successfully',
        data: result,
    });
}));
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.commentService.createComment(req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Comment created successfully',
        data: result,
    });
}));
const updateComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.query;
    const result = yield comment_service_1.commentService.updateComment(commentId, req.body);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment updated successfully',
        data: result,
    });
}));
const softDeleteComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.query;
    const result = yield comment_service_1.commentService.softDeleteComment(commentId);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment deleted successfully',
        data: result,
    });
}));
exports.commentController = {
    getComments,
    getSingleComment,
    createComment,
    updateComment,
    softDeleteComment,
};
