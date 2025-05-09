"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategory = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Category name is required' }),
});
const updateCategory = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Category name is required' }).optional(),
    categoryImage: zod_1.z.string().optional(),
});
exports.categoryValidation = {
    createCategory,
    updateCategory,
};
