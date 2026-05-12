import { Section } from "../models/section.model.js";

class SectionController {
    static async createSection(req, res) {
        try {
            const { name, strength, status } = req.body;

            if (!name || !strength) {
                return res.status(400).json({ message: "Name and strength are required", status: 400 });
            }

            const existingSection = await Section.findOne({ name });
            if (existingSection) {
                return res.status(400).json({ message: "Section with this name already exists", status: 400 });
            }

            const section = await Section.create({
                name,
                strength,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Section created successfully",
                status: 201,
                data: section
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllSections(req, res) {
        try {
            const sections = await Section.find().sort({ name: 1 });
            return res.status(200).json({
                message: "Sections fetched successfully",
                status: 200,
                sections: sections,
                data: sections
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteSection(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Section.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Section not found", status: 404 });
            }
            return res.status(200).json({ message: "Section deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default SectionController;
