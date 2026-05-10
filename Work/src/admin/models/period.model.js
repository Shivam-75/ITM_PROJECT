import mongoose from "mongoose";

const periodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, { timestamps: true });

export const Period = mongoose.models.Period || mongoose.model("Period", periodSchema, "periods");
