import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    strength: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, { timestamps: true });

export const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema, "sections");
