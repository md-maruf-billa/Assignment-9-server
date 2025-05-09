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
exports.voteService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../utils/AppError");
const Prisma_1 = require("../../utils/Prisma");
const castVote = (accountEmail, reviewId, type) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Check if the review exists
    const review = yield Prisma_1.prisma.review.findUnique({
        where: { id: reviewId },
    });
    if (!review) {
        throw new AppError_1.AppError('The review you are trying to vote on does not exist', http_status_1.default.NOT_FOUND);
    }
    // ✅ Check if the vote already exists
    const existingVote = yield Prisma_1.prisma.vote.findUnique({
        where: { reviewId_accountEmail: { reviewId, accountEmail } },
    });
    if (existingVote) {
        // Update existing vote if type is different
        if (existingVote.type !== type) {
            return yield Prisma_1.prisma.vote.update({
                where: { reviewId_accountEmail: { reviewId, accountEmail } },
                data: { type },
            });
        }
        else {
            // If same vote type, return without change
            return existingVote;
        }
    }
    // ✅ Create a new vote
    return yield Prisma_1.prisma.vote.create({
        data: { reviewId, accountEmail, type },
    });
});
const unvote = (accountEmail, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const vote = yield Prisma_1.prisma.vote.findUnique({
        where: { reviewId_accountEmail: { reviewId, accountEmail } },
    });
    if (!vote) {
        throw new AppError_1.AppError('No existing vote to remove', http_status_1.default.NOT_FOUND);
    }
    return yield Prisma_1.prisma.vote.delete({
        where: { reviewId_accountEmail: { reviewId, accountEmail } },
    });
});
const getAllVote = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Prisma_1.prisma.vote.findMany();
});
exports.voteService = {
    castVote,
    unvote,
    getAllVote,
};
