import { ModelPaper } from "../models/modelPaper.model.js";

class ModelPaperController {
    static async uploader(req, res) {
        const userId = req.user.id;
        try {
            const { subject, semester, section, year, department } = req.body;
            const paperImage = req.file ? `/public/faculty/${req.file.filename}` : null;

            if (!subject || !semester || !section || !year || !department || !paperImage) {
                return res.status(400).json({ message: "Fill all columns properly (including the paper file) !!", status: 400 });
            }

            const newPaper = await ModelPaper.create({
                userId,
                subject,
                semester,
                section,
                year,
                department,
                paperImage
            });

            return res.status(201).json({
                message: "Model Paper Uploaded Successfully !!",
                status: 201,
                data: newPaper
            });

        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllPapers(req, res) {
        try {
            const papers = await ModelPaper.find().sort({ createdAt: -1 });
            return res.status(200).json({
                message: "Fetched All Model Papers Successfully",
                status: 200,
                data: papers
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getTeacherPapers(req, res) {
        try {
            const userId = req.user.id;
            const papers = await ModelPaper.find({ userId }).sort({ createdAt: -1 });
            return res.status(200).json({
                message: "Fetched Teacher's Model Papers Successfully",
                status: 200,
                data: papers
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deletePaper(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ModelPaper.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Model Paper Not Found", status: 404 });
            }
            return res.status(200).json({ message: "Model Paper Deleted Successfully !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async updatePaper(req, res) {
        try {
            const { id } = req.params;
            const { subject, semester, section, year, department } = req.body;
            
            const updateData = { subject, semester, section, year, department };
            
            if (req.file) {
                updateData.paperImage = `/public/faculty/${req.file.filename}`;
            }

            const updated = await ModelPaper.findByIdAndUpdate(id, updateData, { new: true });
            
            if (!updated) {
                return res.status(404).json({ message: "Model Paper Not Found", status: 404 });
            }

            return res.status(200).json({
                message: "Model Paper Updated Successfully !!",
                status: 200,
                data: updated
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default ModelPaperController;
