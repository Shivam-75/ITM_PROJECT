import { AcademicBatches } from "../models/academicBatches.model.js";

class AcademicBatchesController {
    static async createBatch(req, res) {
        try {
            const { name, startingYear, endingYear, status } = req.body;

            if (!name || !startingYear || !endingYear) {
                return res.status(400).json({ message: "Name, starting year, and ending year are required", status: 400 });
            }

            const existingBatch = await AcademicBatches.findOne({ name });
            if (existingBatch) {
                return res.status(400).json({ message: "Batch with this name already exists", status: 400 });
            }

            const batch = await AcademicBatches.create({
                name,
                startingYear,
                endingYear,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Academic Batch created successfully",
                status: 201,
                data: batch
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async getAllBatches(req, res) {
        try {
            const batches = await AcademicBatches.find().sort({ startingYear: -1 });
            return res.status(200).json({
                message: "Academic Batches fetched successfully",
                status: 200,
                batches
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async deleteBatch(req, res) {
        try {
            const { id } = req.params;
            const deleted = await AcademicBatches.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Batch not found", status: 404 });
            }
            return res.status(200).json({ message: "Academic Batch deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default AcademicBatchesController;
