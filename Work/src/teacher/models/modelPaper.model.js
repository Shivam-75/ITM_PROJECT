import mongoose from "mongoose";

const modelPaperSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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
    paperImage: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const ModelPaper = mongoose.models.ModelPaper || mongoose.model("ModelPaper", modelPaperSchema, "modelpapers");
