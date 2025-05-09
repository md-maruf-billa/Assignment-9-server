"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouters = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/', user_controller_1.userController.getUsers);
router.get('/:id', user_controller_1.userController.getUserById);
router.patch('/', (0, auth_1.default)('USER'), uploader_1.default.single('image'), (req, res, next) => {
    req.body = user_validation_1.userValidation.updateUser.parse(JSON.parse(req.body.data));
    user_controller_1.userController.updateUser(req, res, next);
});
router.delete('/', (0, auth_1.default)('USER'), user_controller_1.userController.deleteUser);
exports.userRouters = router;
