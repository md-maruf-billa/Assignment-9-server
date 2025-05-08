import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { team_validation } from "./team.validation";
import { team_controllers } from "./team.controller";
import uploader from "../../middlewares/uploader";

const teamRouter = Router()


teamRouter.post("/",
    auth("ADMIN"),
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = team_validation.create.parse(JSON.parse(req.body.data))
        team_controllers.create_new_team(req, res, next)
    },
)
teamRouter.patch("/:id",
    auth("ADMIN"),
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = team_validation.update.parse(JSON.parse(req.body.data))
        team_controllers.update_team_member(req, res, next)
    },
)

teamRouter.get("/", team_controllers.get_all_team_member)
teamRouter.get("/:id", team_controllers.get_unique_team_member)
teamRouter.delete("/:id", team_controllers.delete_team_member)

export default teamRouter;