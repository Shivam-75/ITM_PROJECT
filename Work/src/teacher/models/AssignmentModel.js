import mongoose from "mongoose";

const AssignmnetSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        lowercase: true
    },
    semester: {
        type: String,
        required: true,
        lowercase: true
    },
    section: {
        type: String,
        required: true
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
        required: true,
        lowercase: true
    },
    submissionDate: {
        type: String,
        required: false
    }

}, { timestamps: true })


export const Assignment = mongoose.models.Assignmnet || mongoose.model("Assignmnet", AssignmnetSchema);