"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createVote = zod_1.default.object({
    reviewId: zod_1.default.string(),
    type: zod_1.default.enum(['UPVOTE', 'DOWNVOTE']),
});
exports.voteValidation = {
    createVote,
};
