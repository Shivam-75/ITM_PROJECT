import mongoose from "mongoose";

const placementSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    jobProfile: { type: String, required: true },
    ctc: { type: String, required: true },
    eligibility: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    deadline: { type: String, required: true },
    description: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "Closed"], default: "pending" }
}, { timestamps: true });

const placementApplicationSchema = new mongoose.Schema({
    placementId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Placement"
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    studentMobile: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
        default: "Applied"
    }
}, { timestamps: true });

export const Placement = mongoose.models.Placement || mongoose.model("Placement", placementSchema, "placements");
export const PlacementApplication = mongoose.models.PlacementApplication || mongoose.model("PlacementApplication", placementApplicationSchema, "placementapplications");
