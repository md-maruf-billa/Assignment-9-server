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
exports.team_services = void 0;
const Prisma_1 = require("../../utils/Prisma");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const create_new_team_member_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const uploadImage = yield (0, cloudinary_1.default)(req === null || req === void 0 ? void 0 : req.file);
        req.body.profileImage = uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.secure_url;
    }
    const result = yield Prisma_1.prisma.team.create({
        data: req === null || req === void 0 ? void 0 : req.body
    });
    return result;
});
const get_all_team_member_from_db = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.team.findMany();
    return result;
});
const get_unique_team_member_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.team.findUnique({ where: { id } });
    if (!result) {
        throw new AppError_1.AppError("Team member not found !", http_status_1.default.NOT_FOUND);
    }
    return result;
});
const delete_team_member_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.team.findUnique({ where: { id } });
    if (!result) {
        throw new AppError_1.AppError("Team member not found !", http_status_1.default.NOT_FOUND);
    }
    yield Prisma_1.prisma.team.delete({
        where: { id }
    });
    return "Team member deleted .";
});
const update_team_member_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const isMemberExist = yield Prisma_1.prisma.team.findUnique({ where: { id } });
    if (!isMemberExist) {
        throw new AppError_1.AppError("Team member not found !", http_status_1.default.NOT_FOUND);
    }
    if (req.file) {
        const uploadImage = yield (0, cloudinary_1.default)(req === null || req === void 0 ? void 0 : req.file);
        req.body.profileImage = uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.secure_url;
    }
    const result = yield Prisma_1.prisma.team.update({
        where: { id },
        data: req === null || req === void 0 ? void 0 : req.body
    });
    return result;
});
exports.team_services = {
    create_new_team_member_into_db,
    get_all_team_member_from_db,
    get_unique_team_member_from_db,
    update_team_member_into_db,
    delete_team_member_from_db
};
