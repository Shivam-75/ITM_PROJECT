import { Subject } from "../models/subject.model.js";

class AcademicController {
    // Subjects
    static async addSubject(req, res) {
        try {
            const { name, code, department, semester, status } = req.body;
            
            if (!name || !code || !department || !semester) {
                return res.status(400).json({ message: "Essential fields missing for subject", status: 400 });
            }

            const newSubject = await Subject.create({
                name,
                code,
                department,
                semester,
                status: status || "Active"
            });

            return res.status(201).json({ message: "Subject added successfully", data: newSubject, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getSubjects(req, res) {
        try {
            const subjects = await Subject.find().sort({ createdAt: -1 });
            return res.status(200).json({ subjects, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteSubject(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Subject.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Subject not found", status: 404 });
            }
            return res.status(200).json({ message: "Subject deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default AcademicController;
