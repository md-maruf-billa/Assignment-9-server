import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { categoryService } from './category.service';

const createCategory = catchAsyncResponse(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  manageResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

export const categoryController = {
  createCategory,
};
