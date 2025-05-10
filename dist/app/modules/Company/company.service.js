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
exports.company_services = void 0;
const AppError_1 = require("../../utils/AppError");
const Prisma_1 = require("../../utils/Prisma");
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const peginationHelper_1 = require("../../utils/peginationHelper");
const company_constant_1 = require("./company.constant");
const get_all_companies_from_db = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = peginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    // Search Logic
    if (searchTerm) {
        andConditions.push({
            OR: company_constant_1.companySearchTerm.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    ;
    // Filter Logic
    if (filterData.name) {
        andConditions.push({
            name: {
                contains: filterData.name,
                mode: 'insensitive',
            },
        });
    }
    if (filterData.email) {
        andConditions.push({
            account: {
                email: {
                    contains: filterData.email,
                    mode: 'insensitive',
                },
            },
        });
    }
    andConditions.push({
        isDeleted: false
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield Prisma_1.prisma.company.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            account: true,
            products: true
        }
    });
    const total = yield Prisma_1.prisma.company.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            skip,
            total,
        },
        data: result
    };
});
const get_specific_company_from_db = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.company.findUnique({
        where: { id, isDeleted: false },
        include: {
            account: true,
            products: {
                include: {
                    category: true,
                    reviews: {
                        include: {
                            ReviewComment: {
                                include: {
                                    account: {
                                        include: {
                                            user: true,
                                            admin: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    });
    if (!result) {
        throw new AppError_1.AppError("Company not found!", http_status_1.default.NOT_FOUND);
    }
    // Enrich each review with product + category details
    const allReviews = result.products.flatMap(product => {
        return product.reviews
            .filter(review => !review.isDeleted)
            .map(review => {
            var _a;
            return (Object.assign(Object.assign({}, review), { productId: product.id, productName: product.name, categoryId: product.categoryId, categoryName: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || null }));
        });
    });
    // Remove `reviews` and `category` from each product to avoid duplication
    const productsWithoutReviews = result.products.map(product => {
        const { reviews, category } = product, rest = __rest(product, ["reviews", "category"]);
        return rest;
    });
    return Object.assign(Object.assign({}, result), { products: productsWithoutReviews, reviews: allReviews });
});
const update_company_info_into_db = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // find first account
    const isAccountExist = yield Prisma_1.prisma.account.findUnique({ where: { email: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email, status: "ACTIVE", isDeleted: false }, include: { company: true } });
    const isExistCompany = yield Prisma_1.prisma.company.findUnique({ where: { accountId: isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.id } });
    if (!isExistCompany) {
        throw new AppError_1.AppError("Company info not found!!", http_status_1.default.NOT_FOUND);
    }
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.companyImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    const updatedInfo = yield Prisma_1.prisma.company.update({ where: { id: isExistCompany.id }, data: req.body });
    return updatedInfo;
});
const delete_account_into_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield Prisma_1.prisma.account.findUnique({ where: { email, isDeleted: false }, include: { company: true } });
    if (!isExistAccount) {
        throw new AppError_1.AppError("Account not found !!", http_status_1.default.NOT_FOUND);
    }
    yield Prisma_1.prisma.$transaction((tranClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield tranClient.account.update({ where: { email }, data: { isDeleted: true } });
        yield tranClient.company.update({ where: { id: (_a = isExistAccount.company) === null || _a === void 0 ? void 0 : _a.id }, data: { isDeleted: true } });
    }));
    return;
});
exports.company_services = {
    get_all_companies_from_db,
    get_specific_company_from_db,
    update_company_info_into_db,
    delete_account_into_db
};
