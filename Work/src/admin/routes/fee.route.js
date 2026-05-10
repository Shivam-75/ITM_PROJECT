import { Router } from "express";
import FeeController from "../controller/Fee.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const feeRoute = Router();

feeRoute.use(AdminVerifation.TokenVerification);

feeRoute.route("/structure").get(FeeController.getFeeStructures).post(FeeController.addFeeStructure);
feeRoute.route("/structure/specific").get(FeeController.getSpecificStructure);
feeRoute.route("/structure/:id").delete(FeeController.deleteFeeStructure);
