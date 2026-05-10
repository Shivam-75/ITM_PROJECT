import { Router } from "express";
import StudentProfileController from "../controller/studentProfile.controller.js";

export const studentProfileRoute = Router();

studentProfileRoute.route("/student-profile").post(StudentProfileController.createProfile);
studentProfileRoute.route("/student-list").get(StudentProfileController.getStudentList);
studentProfileRoute.route("/student-profile/:id").delete(StudentProfileController.deleteProfile);
