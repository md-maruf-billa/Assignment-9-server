import status from 'http-status';
import catchAsyncResponse from '../../utils/catchAsync';
import manageResponse from '../../utils/manageRes';
import { categoryService } from './category.service';
import pickQuery from '../../utils/pickQuery';
import { categoryFilterableFields, categoryPaginationFields } from './category.constant';

const createCategory = catchAsyncResponse(async (req, res) => {
    const result = await categoryService.createCategory(req);
    manageResponse(res, {
        statusCode: status.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});


const getCategories = catchAsyncResponse(async (req, res) => {

    const filters = pickQuery(req.query, categoryFilterableFields);
    const options = pickQuery(req.query, categoryPaginationFields);

    const result = await categoryService.getCategories(filters, options);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Categories fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});


const getCategoryById = catchAsyncResponse(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.getCategoryById(id);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Category fetched successfully!',
        data: result,
    });
});


const updateCategory = catchAsyncResponse(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.updateCategory(id, req);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Category Updated Successfully!',
        data: result,
    });
});


const deleteCategory = catchAsyncResponse(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    manageResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Category Deleted Successfully!',
        data: null,
    });
});

export const categoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
