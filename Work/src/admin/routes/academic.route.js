import { Router } from "express";
import AcademicController from "../controller/Academic.controller.js";
import CourseController from "../controller/Course.controller.js";
import SectionController from "../controller/Section.controller.js";
import SemesterController from "../controller/Semester.controller.js";
import YearController from "../controller/Year.controller.js";
import AcademicBatchesController from "../controller/academicBatches.controller.js";
import PeriodController from "../controller/Period.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";
import GlobalAccessChecker from "../../common/middleware/GlobalAccessChecker.js";

export const academicRoute = Router();

// --- Registry Viewing (Public to Authenticated Users) ---
academicRoute.route("/subjects").get(GlobalAccessChecker.viewOnly, AcademicController.getSubjects);
academicRoute.route("/batches").get(GlobalAccessChecker.viewOnly, AcademicBatchesController.getAllBatches);
academicRoute.route("/courses").get(GlobalAccessChecker.viewOnly, CourseController.getAllCourses);
academicRoute.route("/periods").get(GlobalAccessChecker.viewOnly, PeriodController.getAllPeriods);
academicRoute.route("/sections").get(GlobalAccessChecker.viewOnly, SectionController.getAllSections);
academicRoute.route("/semesters").get(GlobalAccessChecker.viewOnly, SemesterController.getAllSemesters);
academicRoute.route("/years").get(GlobalAccessChecker.viewOnly, YearController.getAllYears);

// --- Registry Management (Admin Only) ---
academicRoute.use(AdminVerifation.TokenVerification);

academicRoute.route("/subjects").post(AcademicController.addSubject);
academicRoute.route("/subjects/:id").delete(AcademicController.deleteSubject);

academicRoute.route("/batches").post(AcademicBatchesController.createBatch);
academicRoute.route("/batches/:id").delete(AcademicBatchesController.deleteBatch);

academicRoute.route("/courses").post(CourseController.createCourse);
academicRoute.route("/courses/:id").delete(CourseController.deleteCourse);

academicRoute.route("/periods").post(PeriodController.createPeriod);
academicRoute.route("/periods/:id").delete(PeriodController.deletePeriod);

academicRoute.route("/sections").post(SectionController.createSection);
academicRoute.route("/sections/:id").delete(SectionController.deleteSection);

academicRoute.route("/semesters").post(SemesterController.createSemester);
academicRoute.route("/semesters/:id").delete(SemesterController.deleteSemester);

academicRoute.route("/years").post(YearController.createYear);
academicRoute.route("/years/:id").delete(YearController.deleteYear);

