"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.team_validation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    name: zod_1.z.string(),
    title: zod_1.z.string(),
    profileImage: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    gitHub: zod_1.z.string(),
    linkedIn: zod_1.z.string(),
    facebook: zod_1.z.string(),
    portfolio: zod_1.z.string()
});
const update = zod_1.z.object({
    name: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    profileImage: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    gitHub: zod_1.z.string().optional(),
    linkedIn: zod_1.z.string().optional(),
    facebook: zod_1.z.string().optional(),
    portfolio: zod_1.z.string().optional()
});
exports.team_validation = {
    create,
    update
};
