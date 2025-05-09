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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const Prisma_1 = require("../../utils/Prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const peginationHelper_1 = require("../../utils/peginationHelper");
const category_constant_1 = require("./category.constant");
const createCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.categoryImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    ;
    return yield Prisma_1.prisma.category.create({
        data: req.body
    });
});
const getCategories = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = peginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: category_constant_1.categorySearchTerm.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    contains: filterData[key],
                    mode: 'insensitive',
                },
            })),
        });
    }
    const whereConditons = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield Prisma_1.prisma.category.findMany({
        where: whereConditons,
        include: {
            reviews: true,
            _count: true,
        },
        skip,
        take: limit,
    });
    const total = yield Prisma_1.prisma.category.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            skip,
            total
        },
        data: result,
    };
});
// const getCategories = async (
//     filters: any,
//     options: IOptions
// ) => {
//     const { searchTerm, ...filterData } = filters;
//     const { limit, page, skip } = paginationHelper.calculatePagination(options);
//     const andConditions: Prisma.CategoryWhereInput[] = [];
//     if (searchTerm) {
//         andConditions.push({
//             OR: categorySearchTerm.map(field => ({
//                 [field]: {
//                     contains: searchTerm,
//                     mode: 'insensitive',
//                 },
//             })),
//         });
//     };
//     // console.log(andConditions);
//     if (Object.keys(filterData).length > 0) {
//         andConditions.push({
//             AND: Object.keys(filterData).map(key => ({
//                 [key]: {
//                     equals: (filterData as any)[key]
//                 }
//             }))
//         })
//     };
//     const whereConditons: Prisma.CategoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
//     const result = await prisma.category.findMany({
//         include: {
//             reviews: true,
//             _count: true
//         }
//     });
//     const total = await prisma.category.count({
//     });
//     return { total, result };
// };
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.category.findUnique({
        where: {
            id
        },
        include: {
            reviews: true,
            _count: true
        }
    });
    if (!result) {
        throw new AppError_1.AppError("Category Not Found", http_status_1.default.NOT_FOUND);
    }
    ;
    return result;
});
const updateCategory = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield Prisma_1.prisma.category.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new AppError_1.AppError("Category Not Found", http_status_1.default.NOT_FOUND);
    }
    ;
    const dataToUpdate = {};
    if (req.body.name) {
        dataToUpdate.name = req.body.name;
    }
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        dataToUpdate.categoryImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    return yield Prisma_1.prisma.category.update({
        where: {
            id
        },
        data: dataToUpdate
    });
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield Prisma_1.prisma.category.findUnique({
        where: {
            id
        }
    });
    if (!isExist) {
        throw new AppError_1.AppError("Category Not Found", http_status_1.default.NOT_FOUND);
    }
    ;
    return yield Prisma_1.prisma.category.delete({
        where: {
            id
        }
    });
});
exports.categoryService = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
