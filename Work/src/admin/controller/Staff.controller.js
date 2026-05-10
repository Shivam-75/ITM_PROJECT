import { Staff } from "../models/staffModel.model.js";
import fs from "fs";
import path from "path";

class StaffController {
    static async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const staff = await Staff.findById(id);
            if (!staff) return res.status(404).json({ message: "Staff member not found", status: 404 });
            return res.status(200).json({ message: "Staff Fetched Successfully !!", status: 200, data: staff });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async addStaff(req, res) {
        try {

            const logMsg = `[${new Date().toISOString()}] ADD: file=${req.file ? req.file.filename : "none"}, body=${JSON.stringify(req.body)}\n`;
            fs.appendFileSync("upload_debug.log", logMsg);

            // Comprehensive Manual Validation
            const { name, email, department, phone, aadhaar, qualification, gender } = req.body;

            if (!name || !email || !department || !phone || !aadhaar || !qualification || !gender) {
                return res.status(400).json({ message: "All fields are required", status: 400 });
            }

            let image;
            if (req.file) {
                // Store relative path: faculty/filename.jpg
                image = `/faculty/${req.file.filename}`;
            }

            const newStaff = await Staff.create({ name, email, department, phone, aadhaar, qualification, gender, image });

            if (!newStaff) {
                return res.status(400).json({ message: "Staff Not Added !!", status: 400 });
            }
            return res.status(201).json({ message: "Staff added successfully", data: newStaff, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getStaffList(req, res) {
        try {
            const staffList = await Staff.find().sort({ createdAt: -1 });

            if (!staffList) {
                return res.status(400).json({ message: "Staff Not Found !!", status: 400 });
            }
            return res.status(200).json({ message: "Staff List Fetched Successfully !!", status: 200, data: staffList });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async updateStaff(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "Staff ID is required for update", status: 400 });

            const updateData = req.body;

            // Basic Validation for Updates
            if (updateData.email === "") return res.status(400).json({ message: "Email cannot be empty", status: 400 });
            if (updateData.name === "") return res.status(400).json({ message: "Name cannot be empty", status: 400 });

            // Handle new uploaded file
            if (req.file) {
                updateData.image = `/faculty/${req.file.filename}`;
            }

            const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedStaff) return res.status(404).json({ message: "Staff member not found", status: 404 });
            return res.status(200).json({ message: "Staff updated successfully", data: updatedStaff, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteStaff(req, res) {
        try {
            const { id } = req.params;
            const deletedStaff = await Staff.findByIdAndDelete(id);
            if (!deletedStaff) return res.status(404).json({ message: "Staff member not found", status: 404 });
            return res.status(200).json({ message: "Staff deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default StaffController;
