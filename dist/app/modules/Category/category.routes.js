"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const router = (0, express_1.Router)();
router.get('/', category_controller_1.categoryController.getCategories);
router.get('/:id', category_controller_1.categoryController.getCategoryById);
router.post('/create-category', (0, auth_1.default)("ADMIN"), uploader_1.default.single("image"), (req, res, next) => {
    req.body = category_validation_1.categoryValidation.createCategory.parse(JSON.parse(req.body.data));
    category_controller_1.categoryController.createCategory(req, res, next);
});
router.patch('/update/:id', (0, auth_1.default)("ADMIN"), uploader_1.default.single("image"), (req, res, next) => {
    if (req.body.data) {
        req.body = category_validation_1.categoryValidation.updateCategory.parse(JSON.parse(req.body.data));
    }
    else {
        req.body = {};
    }
    category_controller_1.categoryController.updateCategory(req, res, next);
});
router.delete('/delete/:id', (0, auth_1.default)("ADMIN"), category_controller_1.categoryController.deleteCategory);
exports.categoryRouter = router;
