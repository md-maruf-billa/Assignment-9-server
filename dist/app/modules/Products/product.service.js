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
exports.productService = void 0;
const Prisma_1 = require("../../utils/Prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const peginationHelper_1 = require("../../utils/peginationHelper");
const getProduct = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = peginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    // Search Logic
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    company: {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    // Filter Logic
    if (filterData.name) {
        andConditions.push({
            name: {
                contains: filterData.name,
                mode: 'insensitive',
            },
        });
    }
    if (filterData.price) {
        andConditions.push({
            price: {
                equals: Number(filterData.price),
            },
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield Prisma_1.prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            company: true,
        },
    });
    const total = yield Prisma_1.prisma.product.count({
        where: {
            isDeleted: false,
        },
    });
    return {
        meta: {
            page,
            limit,
            skip,
            total,
        },
        result,
    };
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.product.findUnique({
        where: { id: id, isDeleted: false },
        include: {
            reviews: {
                include: {
                    ReviewComment: {
                        include: {
                            account: {
                                include: {
                                    user: true,
                                    admin: true,
                                }
                            }
                        }
                    },
                }
            }
        }
    });
    if (!result) {
        throw new AppError_1.AppError('Product not found!!', http_status_1.default.NOT_FOUND);
    }
    return result;
});
const get_product_by_category_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.product.findMany({
        where: { categoryId: id },
        include: { reviews: true }
    });
    return result;
});
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = req.user;
    const isAccountExist = yield Prisma_1.prisma.account.findUnique({
        where: { email },
        include: { company: true },
    });
    if (!isAccountExist) {
        throw new AppError_1.AppError('Company account not authorized !!', http_status_1.default.NOT_FOUND);
    }
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.imageUrl = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    req.body.companyId = (_a = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.company) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield Prisma_1.prisma.product.create({
        data: req.body,
    });
    return result;
});
const updateProduct = (id, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistProduct = yield Prisma_1.prisma.product.findUnique({ where: { id } });
    if (!isExistProduct) {
        throw new AppError_1.AppError('Product not found !!', http_status_1.default.NOT_FOUND);
    }
    if (requestData.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(requestData.file);
        requestData.body.imageUrl = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    const result = yield Prisma_1.prisma.product.update({
        where: { id: id },
        data: requestData.body,
        include: { company: true, category: true },
    });
    return result;
});
const softDeleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistProduct = yield Prisma_1.prisma.product.findUnique({ where: { id } });
    if (!isExistProduct) {
        throw new AppError_1.AppError('Product not found !!', http_status_1.default.NOT_FOUND);
    }
    const result = yield Prisma_1.prisma.product.update({
        where: { id: id, isDeleted: false },
        data: { isDeleted: true },
    });
    return result;
});
exports.productService = {
    getProduct,
    getSingleProduct,
    createProduct,
    updateProduct,
    softDeleteProduct,
    get_product_by_category_from_db
};
