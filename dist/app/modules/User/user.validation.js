"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.updateUser = void 0;
const zod_1 = require("zod");
exports.updateUser = zod_1.z.object({
    name: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
});
exports.userValidation = {
    updateUser: exports.updateUser,
};
