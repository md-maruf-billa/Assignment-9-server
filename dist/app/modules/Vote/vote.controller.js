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
exports.voteController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const manageRes_1 = __importDefault(require("../../utils/manageRes"));
const vote_service_1 = require("./vote.service");
const castVote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, type } = req.body;
    const accountEmail = req.user.email;
    const result = yield vote_service_1.voteService.castVote(accountEmail, reviewId, type);
    (0, manageRes_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Vote cast successfully',
        data: result,
    });
}));
const unVote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.query;
    const accountEmail = req.user.email;
    const result = yield vote_service_1.voteService.unvote(accountEmail, reviewId);
    (0, manageRes_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Vote removed successfully',
        data: result,
    });
}));
const getAllVote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vote_service_1.voteService.getAllVote();
    (0, manageRes_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All votes retrieved successfully',
        data: result,
    });
}));
exports.voteController = {
    castVote,
    unVote,
    getAllVote,
};
