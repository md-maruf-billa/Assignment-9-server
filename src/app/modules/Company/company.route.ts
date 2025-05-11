import { NextFunction, Request, Response, Router } from "express";
import { company_controllers } from "./company.controller";
import { company_validation_schemas } from "./company.validation";
import uploader from "../../middlewares/uploader";
import auth from "../../middlewares/auth";

const companyRoute = Router()


companyRoute.get("/", company_controllers.get_all_companies)
companyRoute.get("/:id", company_controllers.get_specific_company)
companyRoute.patch(
    "/",
    auth("COMPANY"),
    uploader.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = company_validation_schemas.update.parse(JSON.parse(req.body?.data))
        company_controllers.update_company_info(req, res, next)
    })


companyRoute.delete("/", auth("COMPANY"), company_controllers.delete_account)


export default companyRoute;