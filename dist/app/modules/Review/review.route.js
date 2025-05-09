"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const review_validation_1 = require("./review.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get('/', review_controller_1.reviewController.getReview);
router.get('/premiumReviews', (0, auth_1.default)('ADMIN'), review_controller_1.reviewController.getAllPremiumReview);
router.get('/:id', review_controller_1.reviewController.getSingleReview);
router.get('/user/:userId', (0, auth_1.default)('ADMIN', 'USER'), review_controller_1.reviewController.getReviewByUserId);
router.post('/create-review', (0, auth_1.default)('ADMIN', 'USER'), (0, requestValidator_1.default)(review_validation_1.reviewValidation.createReview), review_controller_1.reviewController.createReview);
router.patch('/update-review', (0, auth_1.default)('ADMIN', 'USER'), (0, requestValidator_1.default)(review_validation_1.reviewValidation.updateReview), review_controller_1.reviewController.updateReview);
router.delete('/delete-review', (0, auth_1.default)('ADMIN', 'USER'), review_controller_1.reviewController.deleteReview);
router.post('/create-review/', (0, auth_1.default)('USER', 'ADMIN'), (0, requestValidator_1.default)(review_validation_1.reviewValidation.createReview), review_controller_1.reviewController.createReview);
exports.default = router;
// primeReview updated
