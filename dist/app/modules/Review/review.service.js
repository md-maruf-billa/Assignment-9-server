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
exports.reviewService = void 0;
const Prisma_1 = require("../../utils/Prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const peginationHelper_1 = require("../../utils/peginationHelper");
const getReview = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = peginationHelper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
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
                    category: {
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
    if (filterData.title) {
        andConditions.push({
            title: {
                contains: filterData.title,
                mode: 'insensitive',
            },
        });
    }
    if (filterData.rating) {
        andConditions.push({
            rating: {
                equals: Number(filterData.rating),
            },
        });
    }
    if (filterData.createdAt) {
        const date = new Date(filterData.createdAt);
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        andConditions.push({
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield Prisma_1.prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            category: {
                select: {
                    name: true,
                },
            },
            product: true,
        },
    });
    const total = yield Prisma_1.prisma.review.count({
        where: whereConditions,
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
const getSingleReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistReview = yield Prisma_1.prisma.review.findUnique({
        where: { id, isDeleted: false },
        include: {
            category: true,
            product: true,
        },
    });
    if (!isExistReview) {
        throw new AppError_1.AppError('Review not found !!', http_status_1.default.NOT_FOUND);
    }
    return isExistReview;
});
const getReviewByUserId = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.review.findMany({
        where: { reviewerEmail: email, isDeleted: false },
        include: {
            product: true,
            category: true,
        },
    });
    if (!result) {
        throw new AppError_1.AppError('Review not found !!', http_status_1.default.NOT_FOUND);
    }
    return result;
});
const createReview = (reviewData, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const isProfileUpdate = yield Prisma_1.prisma.account.findUnique({
        where: { email },
        include: {
            user: true,
            admin: true,
        },
    });
    // return isProfileUpdate;
    if (!isProfileUpdate) {
        throw new AppError_1.AppError('Account not found !!', http_status_1.default.NOT_FOUND);
    }
    // if (isProfileUpdate.isCompleteProfile === false) {
    //   throw new AppError(
    //     'Please complete your profile first',
    //     status.BAD_REQUEST,
    //   );
    // }
    const userData = {
        reviewerName: ((_a = isProfileUpdate === null || isProfileUpdate === void 0 ? void 0 : isProfileUpdate.user) === null || _a === void 0 ? void 0 : _a.name) || ((_b = isProfileUpdate === null || isProfileUpdate === void 0 ? void 0 : isProfileUpdate.admin) === null || _b === void 0 ? void 0 : _b.name),
        reviewerEmail: isProfileUpdate === null || isProfileUpdate === void 0 ? void 0 : isProfileUpdate.email,
        reviewerProfilePhoto: ((_c = isProfileUpdate === null || isProfileUpdate === void 0 ? void 0 : isProfileUpdate.admin) === null || _c === void 0 ? void 0 : _c.profileImage) ||
            ((_d = isProfileUpdate === null || isProfileUpdate === void 0 ? void 0 : isProfileUpdate.user) === null || _d === void 0 ? void 0 : _d.profileImage),
    };
    const data = Object.assign(Object.assign({}, reviewData), userData);
    const result = yield Prisma_1.prisma.review.create({
        data: Object.assign({}, data),
    });
    return result;
});
const updateReview = (updatedData, reviewId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield Prisma_1.prisma.review.findUniqueOrThrow({
        where: { id: reviewId, isDeleted: false },
    });
    if (!existing || existing.reviewerEmail !== email) {
        throw new AppError_1.AppError('Unauthorized or review not found', http_status_1.default.UNAUTHORIZED);
    }
    const result = yield Prisma_1.prisma.review.update({
        where: { id: reviewId },
        data: updatedData,
    });
    return result;
});
const deleteReview = (reviewId, email) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield Prisma_1.prisma.review.findUniqueOrThrow({
        where: { id: reviewId, isDeleted: false },
    });
    if ((existing === null || existing === void 0 ? void 0 : existing.reviewerEmail) !== email) {
        throw new AppError_1.AppError('Unauthorized to delete this review', http_status_1.default.UNAUTHORIZED);
    }
    const result = yield Prisma_1.prisma.review.update({
        where: { id: reviewId },
        data: { isDeleted: true },
    });
    return result;
});
const getAllPremiumReview = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Prisma_1.prisma.review.findMany({
        where: { isDeleted: false, isPremium: true },
        include: {
            category: true,
            product: true,
        },
    });
    if (!result) {
        throw new AppError_1.AppError('No premium reviews found', http_status_1.default.NOT_FOUND);
    }
    return result;
});
const manage_votes_into_db = (reviewId, type, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new AppError_1.AppError('You are not authorized !!', http_status_1.default.BAD_REQUEST);
    }
    const isReviewExist = yield Prisma_1.prisma.review.findUnique({
        where: { id: reviewId, isDeleted: false },
    });
    if (!isReviewExist) {
        throw new AppError_1.AppError('Review not found !!', http_status_1.default.NOT_FOUND);
    }
    // Check if the email has already voted for this review
    const existingVote = yield Prisma_1.prisma.reviewEmailVote.findUnique({
        where: {
            reviewId_email: {
                reviewId: reviewId,
                email: email,
            },
        },
    });
    if (existingVote) {
        throw new AppError_1.AppError('You have already voted for this review....', http_status_1.default.BAD_REQUEST);
    }
    // Create a record that this email has voted for this review
    yield Prisma_1.prisma.reviewEmailVote.create({
        data: {
            reviewId: reviewId,
            email: email,
        },
    });
    if (type == 'up') {
        yield Prisma_1.prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                upVotes: isReviewExist.upVotes + 1,
            },
        });
    }
    else if (type == 'down') {
        yield Prisma_1.prisma.review.update({
            where: {
                id: reviewId,
            },
            data: {
                downVotes: isReviewExist.downVotes + 1,
            },
        });
    }
    return;
});
exports.reviewService = {
    createReview,
    updateReview,
    deleteReview,
    getReview,
    getSingleReview,
    getReviewByUserId,
    getAllPremiumReview,
    manage_votes_into_db,
};
