import { Placement, PlacementApplication } from "../models/placement.model.js";

class PlacementController {
    // Placements
    static async createPlacement(req, res) {
        try {
            const { companyName, jobProfile, ctc, eligibility, course, semester, deadline, description, teacherId, status } = req.body;
            
            if (!companyName || !jobProfile || !ctc || !eligibility || !course || !semester || !deadline || !teacherId) {
                return res.status(400).json({ message: "Essential fields missing for placement drive", status: 400 });
            }

            const placement = await Placement.create({
                companyName,
                jobProfile,
                ctc,
                eligibility,
                course,
                semester,
                deadline,
                description,
                teacherId,
                status: status || "pending"
            });

            return res.status(201).json({ message: "Placement drive created successfully", status: 201, data: placement });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getPlacements(req, res) {
        try {
            const placements = await Placement.find().sort({ createdAt: -1 });
            return res.status(200).json({ message: "Placements fetched successfully", status: 200, data: placements });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Applications
    static async applyForPlacement(req, res) {
        try {
            const { placementId, studentId, studentName, course, semester, studentMobile } = req.body;

            if (!placementId || !studentId || !studentName || !course || !semester || !studentMobile) {
                return res.status(400).json({ message: "Fill all required fields", status: 400 });
            }

            // Check if already applied
            const existing = await PlacementApplication.findOne({ placementId, studentId });
            if (existing) {
                return res.status(400).json({ message: "You have already applied for this drive", status: 400 });
            }

            const application = await PlacementApplication.create({
                placementId,
                studentId,
                studentName,
                course,
                semester,
                studentMobile,
                status: "Applied"
            });

            return res.status(201).json({ message: "Application submitted successfully", status: 201, data: application });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getApplications(req, res) {
        try {
            const { placementId } = req.query;
            const filter = placementId ? { placementId } : {};
            const applications = await PlacementApplication.find(filter).sort({ createdAt: -1 });
            return res.status(200).json({ message: "Applications fetched successfully", status: 200, data: applications });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async updateApplicationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await PlacementApplication.findByIdAndUpdate(id, { status }, { new: true });
            if (!updated) {
                return res.status(404).json({ message: "Application not found", status: 404 });
            }
            return res.status(200).json({ message: "Status updated successfully", status: 200, data: updated });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default PlacementController;
