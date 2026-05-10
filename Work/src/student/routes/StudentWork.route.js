import { Router } from "express";
import StudentAccessChecker from "../middleware/StudentChecker.js";
import StudentwrokController from "../controller/StudentWork.Controller.js";



export const StudentWorkRoute = Router();

StudentWorkRoute.route("/HomeWork/getHwDpt").get(StudentAccessChecker.userVerification, StudentwrokController.ShowDepartmentHw);
StudentWorkRoute.route("/Assignment/getAssDpt").get(StudentAccessChecker.userVerification, StudentwrokController.ShoDepartmentAss)
StudentWorkRoute.route("/Notice/getNoticeDpt").get(StudentAccessChecker.userVerification, StudentwrokController.showDepartmentNotice)
StudentWorkRoute.route("/Link/getLinkDpt").get(StudentAccessChecker.userVerification, StudentwrokController.showDepartmentLink)
StudentWorkRoute.route("/Syllabus/getSyllabus").get(StudentAccessChecker.userVerification, StudentwrokController.showSyllabus);
StudentWorkRoute.route("/ModelPaper/all").get(StudentAccessChecker.userVerification, StudentwrokController.showModelPaper);