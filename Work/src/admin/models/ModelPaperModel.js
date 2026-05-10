import mongoose from "mongoose";

const modelPaperSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        lowercase: true
    },
    semester: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    totalMarks: {
        type: String, // String to support labels like "70 + 30"
        default: "70"
    },
    duration: {
        type: String,
        default: "3 Hours"
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String
    }
}, { timestamps: true });

export const ModelPaper = mongoose.models.ModelPaper || mongoose.model("ModelPaper", modelPaperSchema);
