import mongoose from 'mongoose';

const REPORT_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/REPORTMICROSERVICESS";
const shivamId = "69e39db0c6a3ffcb48d57203";

const studentAttendanceSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    status: { type: String, enum: ["Present", "Absent"] }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    teacherId: String,
    date: String,
    subject: { type: String, lowercase: true },
    course: { type: String, lowercase: true },
    semester: Number,
    section: { type: String, lowercase: true },
    records: [studentAttendanceSchema]
});

async function run() {
    try {
        const conn = await mongoose.createConnection(REPORT_DB_URL).asPromise();
        console.log("Connected to REPORT DB");

        const Attendance = conn.model('Attendance', attendanceSchema);

        await Attendance.deleteMany({ course: 'bca', section: 'a1' });

        const days = ["2026-04-10", "2026-04-11", "2026-04-12", "2026-04-13", "2026-04-14"];
        const subjects = ["mathematics iii", "c++ programming", "operating systems", "dbms"];

        const entries = [];

        days.forEach(date => {
            subjects.forEach(sub => {
                entries.push({
                    teacherId: "teacher_123",
                    date: date,
                    subject: sub,
                    course: "bca",
                    semester: 3,
                    section: "a1",
                    records: [
                        { studentId: shivamId, name: "shivam pandey", status: Math.random() > 0.2 ? "Present" : "Absent" },
                        { studentId: "other_1", name: "Rahul", status: "Present" },
                        { studentId: "other_2", name: "Anjali", status: "Absent" }
                    ]
                });
            });
        });

        await Attendance.insertMany(entries);

        console.log("Attendance Data Seeded Successfully for Shivam (BCA A1)");
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

run();
