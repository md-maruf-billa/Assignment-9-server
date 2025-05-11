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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../utils/AppError");
const Prisma_1 = require("../../utils/Prisma");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const peginationHelper_1 = require("../../utils/peginationHelper");
const emailSender_1 = require("../../utils/emailSender");
// get all users
const getUsers = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
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
                    bio: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    account: {
                        email: {
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
    if (filterData.email) {
        andConditions.push({
            account: {
                email: {
                    contains: filterData.email,
                    mode: 'insensitive'
                }
            }
        });
    }
    andConditions.push({
        isDeleted: false
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const users = yield Prisma_1.prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                    isPremium: true,
                }
            }
        }
    });
    const total = yield Prisma_1.prisma.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            skip,
            total
        },
        users
    };
});
// find by id
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Prisma_1.prisma.user.findUnique({
        where: {
            id,
            isDeleted: false
        },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    isDeleted: true,
                    status: true,
                    isCompleteProfile: true,
                    isPremium: true
                }
            }
        }
    });
    if (!user) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    ;
    return user;
});
// update user
const updateUser = (email, req) => __awaiter(void 0, void 0, void 0, function* () {
    // find account and user account
    const isAccountExist = yield Prisma_1.prisma.account.findUnique({
        where: {
            email,
            isDeleted: false
        },
        include: {
            user: true,
            admin: true
        }
    });
    if (!isAccountExist) {
        throw new AppError_1.AppError('User not found', http_status_1.default.NOT_FOUND);
    }
    ;
    // main update logic
    if (req.file) {
        const uploadedImage = yield (0, cloudinary_1.default)(req.file);
        req.body.profileImage = uploadedImage === null || uploadedImage === void 0 ? void 0 : uploadedImage.secure_url;
    }
    ;
    yield Prisma_1.prisma.$transaction((tClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if ((isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.role) == "ADMIN") {
            yield tClient.admin.update({
                where: {
                    id: (_a = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.admin) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: req.body,
            });
        }
        else {
            yield tClient.user.update({
                where: {
                    id: (_b = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.user) === null || _b === void 0 ? void 0 : _b.id
                },
                data: req.body,
                include: {
                    account: true
                }
            });
        }
        yield tClient.account.update({
            where: {
                email
            },
            data: {
                isCompleteProfile: true
            },
            include: {
                user: true
            }
        });
    }));
    (0, emailSender_1.EmailSender)(isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.email, "Profile update successful.", `
          <p>Hi there,</p>
      
          <p>Your profile is successfully updated. Thanks for stay with us.😍😍😍😍</p>
        `);
    return "Profile update successful.";
});
// delete user
const deleteUserFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExist = yield Prisma_1.prisma.account.findUnique({
        where: {
            email,
            isDeleted: false
        },
        include: {
            user: true
        },
    });
    if (!isAccountExist) {
        throw new AppError_1.AppError('Account not found', http_status_1.default.NOT_FOUND);
    }
    ;
    return yield Prisma_1.prisma.$transaction((tClient) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const deleteUser = yield tClient.user.update({
            where: {
                id: (_a = isAccountExist === null || isAccountExist === void 0 ? void 0 : isAccountExist.user) === null || _a === void 0 ? void 0 : _a.id
            },
            data: {
                isDeleted: true
            }
        });
        yield tClient.account.update({
            where: {
                email
            },
            data: {
                isDeleted: true
            }
        });
        return { isDeleted: deleteUser.isDeleted };
    }));
});
exports.userService = {
    getUsers,
    getUserById,
    updateUser,
    deleteUserFromDB,
};
