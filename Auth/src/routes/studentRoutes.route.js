import { Router } from "express";
import StudentController from "../controller/studentControllers.controller.js";
import StudentAccessChecker from "../middleware/StudentChecker.js";

export const StudentRoutes = Router();
StudentRoutes.route("/registration").post(StudentController.Registration);
StudentRoutes.route("/registration/next-id").get(StudentController.GetNextId);

StudentRoutes.route("/login").post(StudentController.Login)

StudentRoutes.route("/userProfile").get(StudentAccessChecker.userVerification, StudentController.StudentProgileShow);
StudentRoutes.route("/Logout").patch(StudentAccessChecker.userVerification, StudentController.StudentLogut);
StudentRoutes.route("/refreshToken").post(StudentController.studentRefreshToken);