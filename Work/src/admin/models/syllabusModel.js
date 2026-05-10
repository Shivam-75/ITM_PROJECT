import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        lowercase: true
    },
    year: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", syllabusSchema);
