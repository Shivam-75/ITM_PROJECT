import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
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
    title: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Notice = mongoose.model("Notice", NoticeSchema); 