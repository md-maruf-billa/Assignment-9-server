import { Router } from "express";
import { company_controllers } from "./company.controller";

const companyRoute = Router()


companyRoute.get("/", company_controllers.get_all_companies)
companyRoute.get("/:id", company_controllers.get_specific_company)



export default companyRoute;