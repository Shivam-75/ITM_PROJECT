import mongoose from "mongoose";

const yearSchema = new mongoose.Schema({
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
        enum: ["Active", "Upcoming", "Closed"],
        default: "Active"
    }
}, { timestamps: true });

export const Year = mongoose.models.Year || mongoose.model("Year", yearSchema, "years");
