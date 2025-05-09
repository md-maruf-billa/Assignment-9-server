"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCommentValidation = void 0;
const zod_1 = require("zod");
const createReviewCommentZodSchema = zod_1.z.object({
    reviewId: zod_1.z.string().uuid({ message: 'Invalid review ID format' }),
    content: zod_1.z.string().min(1, { message: 'Content is required' }),
});
const updateReviewCommentZodSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, { message: 'Content cannot be empty' }).optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.ReviewCommentValidation = {
    createReviewComment: createReviewCommentZodSchema,
    updateReviewComment: updateReviewCommentZodSchema,
};
