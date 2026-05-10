import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    deptCode: {
        type: String,
        required: true
    },
    hod: {
        type: String
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, { timestamps: true });

export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema, "courses");
