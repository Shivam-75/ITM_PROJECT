import { Router } from "express";
import AcademicDocumentController from "../controller/AcademicDocument.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const academicDocRoute = Router();

// --- Syllabus ---
academicDocRoute.route("/Syllabus")
    .post(AdminVerifation.TokenVerification, AcademicDocumentController.createSyllabus)
    .get(AcademicDocumentController.getAllSyllabus);

academicDocRoute.route("/Syllabus/:id")
    .delete(AdminVerifation.TokenVerification, AcademicDocumentController.deleteSyllabus);

// --- Model Papers ---
academicDocRoute.route("/ModelPaper")
    .post(AdminVerifation.TokenVerification, AcademicDocumentController.createModelPaper)
    .get(AcademicDocumentController.getModelPapers);

academicDocRoute.route("/ModelPaper/:id")
    .delete(AdminVerifation.TokenVerification, AcademicDocumentController.deleteModelPaper);
