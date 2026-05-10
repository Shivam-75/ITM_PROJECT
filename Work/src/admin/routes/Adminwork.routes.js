import { Router } from "express";
import AdminVerifation from "../middleware/adminVerication.js";
import AdminWorkController from "../controller/AdminWork.Controller.js";

export const AdminworkRoute = Router();

AdminworkRoute.route("/HomeWork/getAll").get(AdminVerifation.TokenVerification, AdminWorkController.homWorkRecords);
AdminworkRoute.route("/Assignment/getAll").get(AdminVerifation.TokenVerification, AdminWorkController.AssWorkRecords);
AdminworkRoute.route("/Notice/getAll").get(AdminVerifation.TokenVerification, AdminWorkController.NoticeRecord);
AdminworkRoute.route("/Link/getAll").get(AdminVerifation.TokenVerification, AdminWorkController.LinkRecorder);