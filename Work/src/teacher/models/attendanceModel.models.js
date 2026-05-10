import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true
    },
    date: {
        type: String, // format YYYY-MM-DD
        required: true
    },
    subject: {
        type: String,
        required: true,
        lowercase: true
    },
    course: {
        type: String,
        required: true,
        lowercase: true
    },
    semester: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true,
        lowercase: true
    },
    records: [studentAttendanceSchema]
}, { timestamps: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
