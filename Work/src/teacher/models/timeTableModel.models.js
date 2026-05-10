import mongoose from "mongoose";

const teachSubject = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    lecture: {
        type: Number,   // ✅ type spelling correct
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    }
});

const timeTableSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
        lowercase: true,
    },
    section: {
        type: String,
        required: true,
        lowercase: true,
    },
    semester: {
        type: String,
        required: true
    },
    timeSheet: [teachSubject]
}, { 
    timestamps: true,
    bufferCommands: false // Disable buffering so queries fail instantly if not connected
});

export const TimeTable = mongoose.models.TimeTable || mongoose.model("TimeTable", timeTableSchema);
