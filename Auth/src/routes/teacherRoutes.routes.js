import { Router } from "express";
import TeacherController from "../controller/teacherControllers.controller.js";
import authorizeAccessChecker from "../middleware/authChecker.js";

export const teacherRoutes = Router();
//? ye sirf admin registration kr sake

teacherRoutes.route("/registration").post(TeacherController.registration);

teacherRoutes.route("/login").post(TeacherController.loginss);
teacherRoutes.route("/verify-contact").post(TeacherController.verifyContact);
teacherRoutes.route("/setup-password").post(TeacherController.setupPassword);

teacherRoutes.route("/userProfile").get(authorizeAccessChecker.userVerification, TeacherController.loginProfiles);
teacherRoutes.route("/Logout").patch(authorizeAccessChecker.userVerification, TeacherController.Logout);
teacherRoutes.route("/refreshToken").post(TeacherController.RefreshTokenApie);
teacherRoutes.route("/StudentList").get(authorizeAccessChecker.userVerification, TeacherController.StudentList);
teacherRoutes.route("/student-list").get(authorizeAccessChecker.userVerification, TeacherController.StudentList);