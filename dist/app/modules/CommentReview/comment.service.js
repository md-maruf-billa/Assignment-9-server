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
exports.commentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../utils/AppError");
const Prisma_1 = require("../../utils/Prisma");
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.reviewComment.findMany({
        where: { isDeleted: false },
    });
    return result;
});
const getSingleComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.reviewComment.findUnique({
        where: { id },
        // include: {
        //   account: true,
        //   review: true,
        // },
    });
    if (!result || result.isDeleted) {
        throw new AppError_1.AppError('Comment not found !!', http_status_1.default.NOT_FOUND);
    }
    return result;
});
const createComment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    const isExistAccount = yield Prisma_1.prisma.account.findUnique({ where: { email, isDeleted: false, status: "ACTIVE" } });
    if (!isExistAccount) {
        throw new AppError_1.AppError("Account not found!!", http_status_1.default.NOT_FOUND);
    }
    const { reviewId, content } = req.body;
    if (!reviewId || !content) {
        throw new AppError_1.AppError('Missing required fields!', http_status_1.default.BAD_REQUEST);
    }
    const result = yield Prisma_1.prisma.reviewComment.create({
        data: {
            reviewId,
            accountId: isExistAccount.id,
            content,
        },
    });
    return result;
});
const updateComment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield Prisma_1.prisma.reviewComment.findUnique({ where: { id } });
    if (!isExist || isExist.isDeleted) {
        throw new AppError_1.AppError('Comment not found !!', http_status_1.default.NOT_FOUND);
    }
    const result = yield Prisma_1.prisma.reviewComment.update({
        where: { id },
        data: {
            content: data.content,
        },
    });
    return result;
});
const softDeleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield Prisma_1.prisma.reviewComment.findUnique({ where: { id } });
    if (!isExist || isExist.isDeleted) {
        throw new AppError_1.AppError('Comment not found !!', http_status_1.default.NOT_FOUND);
    }
    const result = yield Prisma_1.prisma.reviewComment.update({
        where: { id },
        data: { isDeleted: true },
    });
    return result;
});
exports.commentService = {
    getAllComments,
    getSingleComment,
    createComment,
    updateComment,
    softDeleteComment,
};
