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
exports.productController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const product_service_1 = require("./product.service");
const pickQuery_1 = __importDefault(require("../../utils/pickQuery"));
const product_constant_1 = require("./product.constant");
const getProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pickQuery_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pickQuery_1.default)(req.query, product_constant_1.productPaginationFields);
    const result = yield product_service_1.productService.getProduct(filters, options);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Products fetched successfully',
        data: result.result,
        meta: result.meta,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.getSingleProduct(req.params.id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Product fetched successfully',
        data: result,
    });
}));
const get_product_by_category = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productService.get_product_by_category_from_db(req.params.id);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Product fetched successfully',
        data: result,
    });
}));
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    const result = yield product_service_1.productService.createProduct(req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield product_service_1.productService.updateProduct(productId, req);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
}));
const softDeleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req === null || req === void 0 ? void 0 : req.params;
    const result = yield product_service_1.productService.softDeleteProduct(productId);
    (0, manageRes_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
}));
exports.productController = {
    getProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    softDeleteProduct,
    get_product_by_category
};
