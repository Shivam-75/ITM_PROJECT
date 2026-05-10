import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, lowercase: true },
    duration: { type: String }, // e.g., "4 Years"
    description: { type: String }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    code: { type: String, unique: true },
    course: { type: String, lowercase: true },
    department: { type: String, lowercase: true },
    semester: { type: String, required: true, lowercase: true },
    credits: { type: Number }
}, { timestamps: true });

export const Subject = mongoose.model("Subject", subjectSchema);
