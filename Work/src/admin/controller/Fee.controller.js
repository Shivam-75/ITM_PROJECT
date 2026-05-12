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

            if (!course || !batch) {
                return res.status(400).json({ message: "Course and Batch are required", status: 400 });
            }

            // Case-insensitive search for flexibility
            const query = {
                course: { $regex: new RegExp(`^${course}$`, 'i') },
                batch: { $regex: new RegExp(`^${batch}$`, 'i') }
            };

            // Only add department if it's provided and not equal to course
            if (department && department !== course) {
                query.department = { $regex: new RegExp(`^${department}$`, 'i') };
            }

            const structure = await FeeStructure.findOne(query);
            
            if (!structure) {
                // If specific with department fails, try just course and batch as fallback
                const fallback = await FeeStructure.findOne({
                    course: { $regex: new RegExp(`^${course}$`, 'i') },
                    batch: { $regex: new RegExp(`^${batch}$`, 'i') }
                });
                
                if (!fallback) {
                    return res.status(404).json({ message: "Fee structure not found for this course/batch", status: 404 });
                }
                return res.status(200).json({ structure: fallback, status: 200 });
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
