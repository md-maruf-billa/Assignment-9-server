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
exports.categoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const category_service_1 = require("./category.service");
const pickQuery_1 = __importDefault(require("../../utils/pickQuery"));
const category_constant_1 = require("./category.constant");
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.categoryService.createCategory(req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
}));
const getCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pickQuery_1.default)(req.query, category_constant_1.categoryFilterableFields);
    const options = (0, pickQuery_1.default)(req.query, category_constant_1.categoryPaginationFields);
    const result = yield category_service_1.categoryService.getCategories(filters, options);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Categories fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield category_service_1.categoryService.getCategoryById(id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Category fetched successfully!',
        data: result,
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield category_service_1.categoryService.updateCategory(id, req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Category Updated Successfully!',
        data: result,
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield category_service_1.categoryService.deleteCategory(id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Category Deleted Successfully!',
        data: null,
    });
}));
exports.categoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
