"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouters = void 0;
const express_1 = require("express");
const comment_controller_1 = require("./comment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
router.get('/', comment_controller_1.commentController.getComments);
router.get('/:id', comment_controller_1.commentController.getSingleComment);
router.post('/create-comment', (0, auth_1.default)('USER', 'ADMIN'), (0, requestValidator_1.default)(comment_validation_1.ReviewCommentValidation.createReviewComment), comment_controller_1.commentController.createComment);
router.patch('/update-comment', (0, auth_1.default)('USER', 'ADMIN'), (0, requestValidator_1.default)(comment_validation_1.ReviewCommentValidation.updateReviewComment), comment_controller_1.commentController.updateComment);
router.delete('/delete-comment', (0, auth_1.default)('USER', 'ADMIN'), comment_controller_1.commentController.softDeleteComment);
exports.commentRouters = router;
