import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ct: {
        type: Number,
        required: true
    },
    Subject: {
        type: String,
        required: true
    },
    ExamType: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    Semester: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    RoomNo: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema, "exams");