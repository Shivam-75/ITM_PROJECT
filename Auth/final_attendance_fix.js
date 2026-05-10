import mongoose from 'mongoose';

const AUTH_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/ITMCOLLEGEAUTH";
const REPORT_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/REPORTMICROSERVICESS";
const shivamId = "69e39db0c6a3ffcb48d57203";

async function run() {
    try {
        // 1. Update Student Semester
        const authConn = await mongoose.createConnection(AUTH_DB_URL).asPromise();
        const Student = authConn.model('Student', new mongoose.Schema({ name: String, semester: Number }));
        await Student.updateOne({ _id: shivamId }, { $set: { semester: 1 } });
        console.log("Updated Student Semester to 1");
        await authConn.close();

        // 2. Seed Attendance for Semester 1
        const reportConn = await mongoose.createConnection(REPORT_DB_URL).asPromise();
        
        const studentAttendanceSchema = new mongoose.Schema({
            studentId: String, name: String, status: String
        }, { _id: false });

        const attendanceSchema = new mongoose.Schema({
            teacherId: String,
            date: String,
            subject: String,
            course: String,
            semester: Number,
            section: String,
            records: [studentAttendanceSchema]
        });

        const Attendance = reportConn.model('Attendance', attendanceSchema);
        await Attendance.deleteMany({ course: 'bca', section: 'a1' });

        const days = ["2026-04-10", "2026-04-11", "2026-04-12", "2026-04-13", "2026-04-14"];
        const subjects = ["Mathematics", "Programming in C", "Computer Networks", "Financial Accounting"];
        const entries = [];

        days.forEach(date => {
            subjects.forEach(sub => {
                entries.push({
                    teacherId: "teacher_123", date, subject: sub, course: "bca", semester: 1, section: "a1",
                    records: [
                        { studentId: shivamId, name: "shivam pandey", status: Math.random() > 0.1 ? "Present" : "Absent" },
                        { studentId: "other_1", name: "Rahul", status: "Present" }
                    ]
                });
            });
        });

        await Attendance.insertMany(entries);
        console.log("Attendance Data Re-Seeded for Semester 1");
        await reportConn.close();

        process.exit(0);
    } catch (err) {
        console.error("Task Failed:", err);
        process.exit(1);
    }
}

run();
