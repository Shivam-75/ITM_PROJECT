import { Period } from "../models/period.model.js";

class PeriodController {
    static async createPeriod(req, res) {
        try {
            const { name, startTime, endTime, status } = req.body;

            if (!name || !startTime || !endTime) {
                return res.status(400).json({ message: "Name, startTime, and endTime are required", status: 400 });
            }

            const existingPeriod = await Period.findOne({ name });
            if (existingPeriod) {
                return res.status(400).json({ message: "Period with this name already exists", status: 400 });
            }

            const period = await Period.create({
                name,
                startTime,
                endTime,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Period created successfully",
                status: 201,
                data: period
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllPeriods(req, res) {
        try {
            const periods = await Period.find().sort({ startTime: 1 });
            return res.status(200).json({
                message: "Periods fetched successfully",
                status: 200,
                periods: periods,
                data: periods
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deletePeriod(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Period.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Period not found", status: 404 });
            }
            return res.status(200).json({ message: "Period deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default PeriodController;
