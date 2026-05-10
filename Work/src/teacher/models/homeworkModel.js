import mongoose from "mongoose";

const HomeworkSchema = new mongoose.Schema({
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


export const Homework = mongoose.model("Homework", HomeworkSchema);