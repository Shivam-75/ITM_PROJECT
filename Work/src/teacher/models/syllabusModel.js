import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
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
    fileUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema, "syllabus");
