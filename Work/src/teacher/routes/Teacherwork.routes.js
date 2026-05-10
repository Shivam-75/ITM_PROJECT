import { Router } from "express"
import homeWrokController from "../controller/TeacherHw.Controller.js";
import authorizeAccessChecker from "../middleware/authChecker.js";
import AssignmnetFacality from "../controller/TeacherAss.Controller.js";
import linksController from "../controller/Teacherlink.Controller.js";
import NoticeController from "../controller/Teachernotice.Controller.js";
import ModelPaperController from "../controller/ModelPaper.controller.js";
import { upload } from "../../admin/middleware/multer.js";

export const TeacherworkRoutes = Router();

TeacherworkRoutes.route("/Homework/uploader").post(authorizeAccessChecker.userVerification, homeWrokController.Homewokuploader).get(authorizeAccessChecker.userVerification, homeWrokController.HomeWorkShow)
TeacherworkRoutes.route("/Homework/Delete/:id").delete(authorizeAccessChecker.userVerification, homeWrokController.HomeworkDelete);
TeacherworkRoutes.route("/Homework/update").put(authorizeAccessChecker.userVerification, homeWrokController.UpdateHomework)


//todo -----Assignment------

TeacherworkRoutes.route("/Assignment/uploader").post(authorizeAccessChecker.userVerification, AssignmnetFacality.uploader).get(authorizeAccessChecker.userVerification, AssignmnetFacality.AssignmnetShow);
TeacherworkRoutes.route("/Assignment/Delete/:id").delete(authorizeAccessChecker.userVerification, AssignmnetFacality.AssignmentDelete)
TeacherworkRoutes.route("/Assignment/updated").put(authorizeAccessChecker.userVerification, AssignmnetFacality.AssignmentUpdate)

//!--------Link------Teacher-----

TeacherworkRoutes.route("/Link/Uploader").post(authorizeAccessChecker.userVerification, linksController.uploader).get(authorizeAccessChecker.userVerification, linksController.showLinks)
TeacherworkRoutes.route("/Link/Delete/:id").delete(authorizeAccessChecker.userVerification, linksController.LinkDelete);
TeacherworkRoutes.route("/Link/updated").put(authorizeAccessChecker.userVerification, linksController.updateLink);


//!-----------notice------Teacher--- To--->Student

TeacherworkRoutes.route("/Notice/uploader").post(authorizeAccessChecker.userVerification, NoticeController.uploader).get(authorizeAccessChecker.userVerification, NoticeController.showNotice)
TeacherworkRoutes.route("/Notice/Delete/:id").delete(authorizeAccessChecker.userVerification, NoticeController.deleteNotice)

//!-----------ModelPaper------Teacher---
TeacherworkRoutes.route("/ModelPaper/uploader").post(authorizeAccessChecker.userVerification, upload.single("paperImage"), ModelPaperController.uploader).get(authorizeAccessChecker.userVerification, ModelPaperController.getTeacherPapers)
TeacherworkRoutes.route("/ModelPaper/Delete/:id").delete(authorizeAccessChecker.userVerification, ModelPaperController.deletePaper)
TeacherworkRoutes.route("/ModelPaper/update/:id").put(authorizeAccessChecker.userVerification, upload.single("paperImage"), ModelPaperController.updatePaper);