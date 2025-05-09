"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const requestValidator_1 = __importDefault(require("../../middlewares/requestValidator"));
const vote_validation_1 = require("./vote.validation");
const vote_controller_1 = require("./vote.controller");
const router = (0, express_1.Router)();
router.get('/', vote_controller_1.voteController.getAllVote);
router.post('/cast', (0, auth_1.default)('USER', 'COMPANY', 'ADMIN'), (0, requestValidator_1.default)(vote_validation_1.voteValidation.createVote), vote_controller_1.voteController.castVote);
router.delete('/unvote', (0, auth_1.default)('USER', 'COMPANY', 'ADMIN'), vote_controller_1.voteController.unVote);
exports.voteRoutes = router;
