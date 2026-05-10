import { Router } from "express";
import AcademicController from "../controller/Academic.controller.js";
import CourseController from "../controller/Course.controller.js";
import SectionController from "../controller/Section.controller.js";
import SemesterController from "../controller/Semester.controller.js";
import YearController from "../controller/Year.controller.js";
import AcademicBatchesController from "../controller/academicBatches.controller.js";
import PeriodController from "../controller/Period.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const academicRoute = Router();

academicRoute.use(AdminVerifation.TokenVerification);

academicRoute.route("/subjects").get(AcademicController.getSubjects).post(AcademicController.addSubject);
academicRoute.route("/subjects/:id").delete(AcademicController.deleteSubject);

// Database-backed Batch Management
academicRoute.route("/batches").get(AcademicBatchesController.getAllBatches).post(AcademicBatchesController.createBatch);
academicRoute.route("/batches/:id").delete(AcademicBatchesController.deleteBatch);

// Database-backed Course Management
academicRoute.route("/courses").get(CourseController.getAllCourses).post(CourseController.createCourse);
academicRoute.route("/courses/:id").delete(CourseController.deleteCourse);

// Database-backed Period Management
academicRoute.route("/periods").get(PeriodController.getAllPeriods).post(PeriodController.createPeriod);
academicRoute.route("/periods/:id").delete(PeriodController.deletePeriod);

// Database-backed Section Management
academicRoute.route("/sections").get(SectionController.getAllSections).post(SectionController.createSection);
academicRoute.route("/sections/:id").delete(SectionController.deleteSection);

// Database-backed Semester Management
academicRoute.route("/semesters").get(SemesterController.getAllSemesters).post(SemesterController.createSemester);
academicRoute.route("/semesters/:id").delete(SemesterController.deleteSemester);

// Database-backed Year Management
academicRoute.route("/years").get(YearController.getAllYears).post(YearController.createYear);
academicRoute.route("/years/:id").delete(YearController.deleteYear);
