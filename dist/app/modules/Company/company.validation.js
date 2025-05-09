"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.company_validation_schemas = void 0;
const zod_1 = require("zod");
const update = zod_1.z.object({
    name: zod_1.z.string().optional(),
    website: zod_1.z.string().optional(),
    companyImage: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.company_validation_schemas = {
    update
};
