import { Syllabus } from "../models/syllabusModel.js";
import { ModelPaper } from "../models/ModelPaperModel.js";

/**
 * @desc Manage Academic Documents (Syllabus & Model Papers)
 */
class AcademicDocumentController {
    // --- Syllabus Logic ---
    static async createSyllabus(req, res) {
        try {
            const { course, year, title, fileUrl } = req.body;
            if (!course || !year || !title || !fileUrl) {
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }
            const data = await Syllabus.create({ 
                course: course.toLowerCase(), 
                year: String(year), 
                title, 
                fileUrl 
            });
            res.status(201).json({ success: true, message: "Syllabus published", data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async getAllSyllabus(req, res) {
        try {
            const data = await Syllabus.find().sort({ createdAt: -1 });
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async deleteSyllabus(req, res) {
        try {
            await Syllabus.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: "Syllabus removed" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    // --- Model Paper Logic ---
    static async createModelPaper(req, res) {
        try {
            const { course, semester, year, subject, totalMarks, duration, fileUrl } = req.body;
            if (!course || !semester || !year || !subject || !fileUrl) {
                return res.status(400).json({ success: false, message: "Identification fields missing" });
            }
            const data = await ModelPaper.create({
                course: course.toLowerCase(),
                semester: String(semester),
                year: String(year),
                subject,
                totalMarks: totalMarks || "70",
                duration: duration || "3 Hours",
                fileUrl
            });
            res.status(201).json({ success: true, message: "Model Paper Published", data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async getModelPapers(req, res) {
        try {
            const { course, semester } = req.query;
            let query = {};
            if (course) query.course = course.toLowerCase();
            if (semester) query.semester = semester;

            const data = await ModelPaper.find(query).sort({ createdAt: -1 });
            res.status(200).json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async deleteModelPaper(req, res) {
        try {
            await ModelPaper.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: "Model Paper Purged" });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

export default AcademicDocumentController;
