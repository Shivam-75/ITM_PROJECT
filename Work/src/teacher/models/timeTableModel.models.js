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
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    time: {
        type: String,
        required: true
    }
});

const timeTableSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true
    },
    timeSheet: [teachSubject]
}, { 
    timestamps: true
});

export const TimeTable = mongoose.models.TimeTable || mongoose.model("TimeTable", timeTableSchema, "timetables");
