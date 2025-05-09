"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReview = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    rating: zod_1.z.number().int().min(1).max(5),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    productId: zod_1.z.string().uuid('Invalid product ID').optional(),
    isPremium: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['PENDING', 'PUBLISHED', 'UNPUBLISHED']).optional(),
    moderationNote: zod_1.z.string().optional(),
});
const updateReview = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional(),
    productId: zod_1.z.string().uuid('Invalid product ID').optional(),
    isPremium: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['PENDING', 'PUBLISHED', 'UNPUBLISHED']).optional(),
    moderationNote: zod_1.z.string().optional(),
});
exports.reviewValidation = {
    createReview,
    updateReview,
};
