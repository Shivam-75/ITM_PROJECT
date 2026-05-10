import { Year } from "../models/year.model.js";

class YearController {
    static async createYear(req, res) {
        try {
            const { name, startingYear, endingYear, status } = req.body;

            if (!name || !startingYear || !endingYear) {
                return res.status(400).json({ message: "Name, startingYear, and endingYear are required", status: 400 });
            }

            const existingYear = await Year.findOne({ name });
            if (existingYear) {
                return res.status(400).json({ message: "Year with this name already exists", status: 400 });
            }

            const year = await Year.create({
                name,
                startingYear,
                endingYear,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Academic year created successfully",
                status: 201,
                data: year
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllYears(req, res) {
        try {
            const years = await Year.find().sort({ startingYear: -1 });
            return res.status(200).json({
                message: "Academic years fetched successfully",
                status: 200,
                data: years
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteYear(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Year.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Year not found", status: 404 });
            }
            return res.status(200).json({ message: "Academic year deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default YearController;
