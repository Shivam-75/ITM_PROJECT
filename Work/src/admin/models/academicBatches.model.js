import mongoose from "mongoose";

const academicBatchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startingYear: {
        type: String,
        required: true
    },
    endingYear: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, { timestamps: true });

export const AcademicBatches = mongoose.model("AcademicBatches", academicBatchesSchema);
