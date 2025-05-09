"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const team_validation_1 = require("./team.validation");
const team_controller_1 = require("./team.controller");
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const teamRouter = (0, express_1.Router)();
teamRouter.post("/", (0, auth_1.default)("ADMIN"), uploader_1.default.single("image"), (req, res, next) => {
    req.body = team_validation_1.team_validation.create.parse(JSON.parse(req.body.data));
    team_controller_1.team_controllers.create_new_team(req, res, next);
});
teamRouter.patch("/:id", (0, auth_1.default)("ADMIN"), uploader_1.default.single("image"), (req, res, next) => {
    req.body = team_validation_1.team_validation.update.parse(JSON.parse(req.body.data));
    team_controller_1.team_controllers.update_team_member(req, res, next);
});
teamRouter.get("/", team_controller_1.team_controllers.get_all_team_member);
teamRouter.get("/:id", team_controller_1.team_controllers.get_unique_team_member);
teamRouter.delete("/:id", team_controller_1.team_controllers.delete_team_member);
exports.default = teamRouter;
