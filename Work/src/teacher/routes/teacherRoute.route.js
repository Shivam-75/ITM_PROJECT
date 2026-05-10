import { Router } from "express";
import teacherSesonalController from "../controller/teacherSesoncalController.controller.js";
import teacherAuthorizeAccessChecker from "../middleware/authChecker.js";
import teacherTimeTableController from "../controller/teacherTimetableController.controller.js";
import ExamScheduleController from "../controller/examSchedule.Controller.controller.js";
import TeacherAttendanceController from "../controller/teacherAttendanceController.controller.js";

export const teacherRoutes = Router();

// Attendance Route
teacherRoutes.route("/Attendance/uploader").post(teacherAuthorizeAccessChecker.userVerification, TeacherAttendanceController.uploader);
teacherRoutes.route("/Attendance/view").get(teacherAuthorizeAccessChecker.userVerification, TeacherAttendanceController.viewAttendance);

teacherRoutes.route("/Mark/uploade").post(teacherAuthorizeAccessChecker.userVerification, teacherSesonalController.uploader).get(teacherAuthorizeAccessChecker.userVerification, teacherSesonalController.markData)
teacherRoutes.route("/Mark/delete/:id").delete(teacherAuthorizeAccessChecker.userVerification, teacherSesonalController.markDelete);


//? 
teacherRoutes.route("/TimeTable/uploader").post(teacherAuthorizeAccessChecker.userVerification, teacherTimeTableController.uploader).get(teacherAuthorizeAccessChecker.userVerification, teacherTimeTableController.showTeacherTimeTable);
teacherRoutes.route("/TimeTable/delete/:id").delete(teacherAuthorizeAccessChecker.userVerification, teacherTimeTableController.deleteTeacherTimeTable);


teacherRoutes.route("/Exam-Schedule/uploader").post(ExamScheduleController.uploader).get(ExamScheduleController.getExams);
teacherRoutes.route("/Exam-Schedule/deleted/:id").delete(ExamScheduleController.deleteExamScedule)
