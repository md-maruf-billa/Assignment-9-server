"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouters = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const router = (0, express_1.Router)();
router.get('/', product_controller_1.productController.getProducts);
router.get('/:id', product_controller_1.productController.getSingleProduct);
router.get('/category/:id', product_controller_1.productController.get_product_by_category);
router.post('/create-product', (0, auth_1.default)('COMPANY', 'ADMIN'), uploader_1.default.single('image'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.createProduct.parse(JSON.parse(req.body.data));
    product_controller_1.productController.createProduct(req, res, next);
});
router.patch('/update-product/:productId', uploader_1.default.single('image'), (0, auth_1.default)('COMPANY', 'ADMIN'), (req, res, next) => {
    req.body = product_validation_1.ProductValidation.updateProduct.parse(JSON.parse(req.body.data));
    product_controller_1.productController.updateProduct(req, res, next);
});
router.delete('/delete-product/:productId', (0, auth_1.default)('COMPANY', 'ADMIN'), product_controller_1.productController.softDeleteProduct);
exports.productRouters = router;
