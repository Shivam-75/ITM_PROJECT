import { Router } from "express";
import FeeController from "../controller/Fee.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const feeRoute = Router();

feeRoute.use(AdminVerifation.TokenVerification);

feeRoute.route("/structure").get(FeeController.getFeeStructures).post(FeeController.addFeeStructure);
feeRoute.route("/payments").get(FeeController.getPayments).post(FeeController.recordPayment);
