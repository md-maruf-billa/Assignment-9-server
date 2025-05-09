"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProduct = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Product name is required' }),
    price: zod_1.z
        .number({ invalid_type_error: 'Price must be a number' })
        .nonnegative({ message: 'Price must be 0 or more' }),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url({ message: 'Invalid image URL' }).optional(),
    companyId: zod_1.z
        .string()
        .uuid({ message: 'Invalid company ID format' })
        .optional(),
    categoryId: zod_1.z.string().uuid()
});
const uploadProduct2 = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Product name is required' }).optional(),
    price: zod_1.z
        .number({ invalid_type_error: 'Price must be a number' })
        .nonnegative({ message: 'Price must be 0 or more' })
        .optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url({ message: 'Invalid image URL' }).optional(),
    companyId: zod_1.z
        .string()
        .uuid({ message: 'Invalid company ID format' })
        .optional(),
});
// const updateProduct = z.object({
//   name: z.string().min(1, { message: 'Product name is required' }).optional(),
//   price: z
//     .number({ invalid_type_error: 'Price must be a number' })
//     .nonnegative({ message: 'Price must be 0 or more' })
//     .optional(),
//   description: z.string().optional(),
//   imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
//   isDeleted: z.boolean().optional(),
//   companyId: z
//     .string()
//     .uuid({ message: 'Invalid company ID format' })
//     .optional(),
// });
exports.ProductValidation = {
    createProduct,
    updateProduct: uploadProduct2,
};
