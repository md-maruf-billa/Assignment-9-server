import { z } from 'zod';

const createProduct = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .nonnegative({ message: 'Price must be 0 or more' }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  companyId: z
    .string()
    .uuid({ message: 'Invalid company ID format' })
    .optional(),
  categoryId: z.string().uuid()
});

const uploadProduct2 = z.object({
  name: z.string().min(1, { message: 'Product name is required' }).optional(),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .nonnegative({ message: 'Price must be 0 or more' })
    .optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  companyId: z
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

export const ProductValidation = {
  createProduct,
  updateProduct: uploadProduct2,
};
