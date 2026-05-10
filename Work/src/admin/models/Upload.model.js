import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["syllabus", "exam-schedule", "notice", "result", "other"]
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);
