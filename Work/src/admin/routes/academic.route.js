import { Router } from "express";
import AcademicController from "../controller/Academic.controller.js";
import FileCourseController from "../controller/FileCourse.controller.js";
import FileSectionController from "../controller/FileSection.controller.js";
import FileSemesterController from "../controller/FileSemester.controller.js";
import FileYearController from "../controller/FileYear.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const academicRoute = Router();

academicRoute.use(AdminVerifation.TokenVerification);

academicRoute.route("/subjects").get(AcademicController.getSubjects).post(AcademicController.addSubject);

// File-based Course Management (Settings)
academicRoute.route("/file-courses").get(FileCourseController.getCourses).post(FileCourseController.addCourse);
academicRoute.route("/file-courses/:id").delete(FileCourseController.deleteCourse);

// File-based Section Management
academicRoute.route("/file-sections").get(FileSectionController.getSections).post(FileSectionController.addSection);
academicRoute.route("/file-sections/:id").delete(FileSectionController.deleteSection);

// File-based Semester Management
academicRoute.route("/file-semesters").get(FileSemesterController.getSemesters).post(FileSemesterController.addSemester);
academicRoute.route("/file-semesters/:id").delete(FileSemesterController.deleteSemester);

// File-based Year Management
academicRoute.route("/file-years").get(FileYearController.getYears).post(FileYearController.addYear);
academicRoute.route("/file-years/:id").delete(FileYearController.deleteYear);

