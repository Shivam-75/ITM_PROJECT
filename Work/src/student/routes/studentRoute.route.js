import { Router } from "express";
import studentSesonalController from "../controller/studentSesonalController.controller.js";
import StudentAccessChecker from "../middleware/StudentChecker.js";
import ExamScheduleController from "../../teacher/controller/examSchedule.Controller.controller.js";


export const studentRoute = Router();


studentRoute.use(StudentAccessChecker.userVerification);

studentRoute.route("/Mark/ShowResult").get(studentSesonalController.showResult);
studentRoute.route("/TimeTable/View/:section").get(studentSesonalController.studentShowTb);
studentRoute.route("/Attendance/Show").get(studentSesonalController.showAttendance);
studentRoute.route("/Exam-Schedule/uploader").get(ExamScheduleController.getExams);
