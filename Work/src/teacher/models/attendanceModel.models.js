import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const attendanceSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    students: [studentAttendanceSchema]
}, { timestamps: true });

export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema, "attendances");
