import { Router } from "express";
import adminSesonalMarkController from "../controller/adminSesonalController.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";
import TeacherAttendanceController from "../../teacher/controller/teacherAttendanceController.controller.js";

export const adminRoute = Router();

adminRoute.route("/Mark/ShowResult/:department").get(AdminVerifation.TokenVerification, adminSesonalMarkController.showDepartmentResult);

adminRoute.route("/Timetable/View/:department").get(adminSesonalMarkController.showDepartmentTimeTable);
adminRoute.route("/Timetable/delete/:id").delete(adminSesonalMarkController.deleteDepartmentTimeTable);

// 🔹 Global Attendance Report for Admin
adminRoute.route("/Attendance/All").get(AdminVerifation.TokenVerification, TeacherAttendanceController.adminViewAttendance);
