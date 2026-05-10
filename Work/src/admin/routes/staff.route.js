import { Router } from "express";
import StaffController from "../controller/Staff.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";
import { upload } from "../middleware/multer.js";

export const staffRoute = Router();

staffRoute.use(AdminVerifation.TokenVerification);

staffRoute.route("/list").get(StaffController.getStaffList);
staffRoute.route("/get/:id").get(StaffController.getStaffById);
staffRoute.route("/add").post(upload.single("image"), StaffController.addStaff);
staffRoute.route("/update/:id").put(upload.single("image"), StaffController.updateStaff);
staffRoute.route("/delete/:id").delete(StaffController.deleteStaff);
