import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    ct: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    Subject: {
        type: String,
        required: true
    },
    ExamType: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    Semester: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    RoomNo: {
        type: String,
        required: true
    }
});

export const Exam = mongoose.model("Exam", examScheduleSchema);