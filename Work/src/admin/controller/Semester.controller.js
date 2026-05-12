import { Semester } from "../models/semester.model.js";

class SemesterController {
    static async createSemester(req, res) {
        try {
            const { name, startDate, endDate, status } = req.body;

            if (!name || !startDate || !endDate) {
                return res.status(400).json({ message: "Name, startDate, and endDate are required", status: 400 });
            }

            const existingSemester = await Semester.findOne({ name });
            if (existingSemester) {
                return res.status(400).json({ message: "Semester with this name already exists", status: 400 });
            }

            const semester = await Semester.create({
                name,
                startDate,
                endDate,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Semester created successfully",
                status: 201,
                data: semester
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllSemesters(req, res) {
        try {
            const semesters = await Semester.find().sort({ name: 1 });
            return res.status(200).json({
                message: "Semesters fetched successfully",
                status: 200,
                semesters: semesters, // Named key for frontend
                data: semesters
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteSemester(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Semester.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Semester not found", status: 404 });
            }
            return res.status(200).json({ message: "Semester deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default SemesterController;
