import { Course, Subject } from "../models/courseModel.model.js";

class AcademicController {
    // Subjects
    static async addSubject(req, res) {
        try {
            const newSubject = await Subject.create(req.body);
            return res.status(201).json({ message: "Subject added successfully", data: newSubject, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getSubjects(req, res) {
        try {
            const subjects = await Subject.find();
            return res.status(200).json({ subjects, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default AcademicController;
