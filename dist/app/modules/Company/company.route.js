"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const company_validation_1 = require("./company.validation");
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const companyRoute = (0, express_1.Router)();
companyRoute.get("/", company_controller_1.company_controllers.get_all_companies);
companyRoute.get("/:id", company_controller_1.company_controllers.get_specific_company);
companyRoute.patch("/", (0, auth_1.default)("COMPANY"), uploader_1.default.single("image"), (req, res, next) => {
    var _a;
    req.body = company_validation_1.company_validation_schemas.update.parse(JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data));
    company_controller_1.company_controllers.update_company_info(req, res, next);
});
companyRoute.delete("/", (0, auth_1.default)("COMPANY"), company_controller_1.company_controllers.delete_account);
exports.default = companyRoute;
