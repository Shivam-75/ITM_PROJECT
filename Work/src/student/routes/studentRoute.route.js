import { Router } from "express";
import studentSesonalController from "../controller/studentSesonalController.controller.js";
import StudentAccessChecker from "../middleware/StudentChecker.js";


export const studentRoute = Router();


studentRoute.use(StudentAccessChecker.userVerification);

studentRoute.route("/Mark/ShowResult/:id").get(studentSesonalController.showResult);
studentRoute.route("/TimeTable/View/:section").get(studentSesonalController.studentShowTb);
studentRoute.route("/Attendance/Show").get(studentSesonalController.showAttendance);
