import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
    collegeName: { type: String, default: "ITM" },
    name: { type: String, required: true, lowercase: true },
    course: { type: String, required: true, lowercase: true },
    year: { type: String, required: true },
    semester: { type: Number, required: true },
    moNumber: { type: Number, required: true },
    stream: { type: String, lowercase: true },
    passingYear: { type: String },
    caste: { type: String },
    gender: { type: String, lowercase: true },
    board: { type: String },
    parentName: { type: String },
    parentMobile: { type: Number },
    motherName: { type: String },
    address: { type: String },
    studentId: { type: String, unique: true },
}, { timestamps: true });

export const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
