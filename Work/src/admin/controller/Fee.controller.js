import { FeeStructure } from "../models/feeStructure.model.js";

class FeeController {
    // Create or Update Fee Structure
    static async addFeeStructure(req, res) {
        try {
            const { department, course, batch } = req.body;

            if (!department || !course || !batch) {
                return res.status(400).json({ message: "Department, Course, and Batch are required", status: 400 });
            }

            // Check if structure already exists for this combination
            let existing = await FeeStructure.findOne({ department, course, batch });

            if (existing) {
                // Update existing
                existing = await FeeStructure.findOneAndUpdate(
                    { department, course, batch },
                    { ...req.body },
                    { new: true }
                );
                return res.status(200).json({ message: "Fee structure updated successfully", data: existing, status: 200 });
            }

            // Create new
            const newFee = await FeeStructure.create(req.body);
            return res.status(201).json({ message: "Fee structure published successfully", data: newFee, status: 201 });

        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Get All Fee Structures
    static async getFeeStructures(req, res) {
        try {
            const structures = await FeeStructure.find().sort({ createdAt: -1 });
            return res.status(200).json({ structures, status: 200 });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Get Single Fee Structure by Department, Course, and Batch
    static async getSpecificStructure(req, res) {
        try {
            const { department, course, batch } = req.query;
            const structure = await FeeStructure.findOne({ department, course, batch });
            
            if (!structure) {
                return res.status(404).json({ message: "Fee structure not found", status: 404 });
            }

            return res.status(200).json({ structure, status: 200 });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Delete Fee Structure
    static async deleteFeeStructure(req, res) {
        try {
            const { id } = req.params;
            await FeeStructure.findByIdAndDelete(id);
            return res.status(200).json({ message: "Fee structure deleted", status: 200 });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default FeeController;
