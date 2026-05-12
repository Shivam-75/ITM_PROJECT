import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true,
        lowercase: true
    },
    section: {
        type: String,
        required: true,
        lowercase: true
    },
    year: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        lowercase: true
    },
    questions: {
        type: [String],
        required: true
    },
    submissionDate: {
        type: String,
        required: false
    }

}, { timestamps: true })


export const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema, "assignmnets");