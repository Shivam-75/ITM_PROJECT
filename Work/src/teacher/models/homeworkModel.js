import mongoose from "mongoose";

const HomeworkSchema = new mongoose.Schema({
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
        required: true
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
        required: true
    },
    questions: {
        type: [String],
        required: true
    },
    submissionDate: {
        type: String,
        required: false
    }

}, { timestamps: true });

export const Homework = mongoose.models.Homework || mongoose.model("Homework", HomeworkSchema, "homeworks");