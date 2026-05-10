import mongoose from 'mongoose';

const REPORT_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/REPORTMICROSERVICESS";
const dummyUserId = "60d5ecb3e4b0c84d1c8e1e1e";

const teachSubject = new mongoose.Schema({
    day: { type: String, required: true },
    teacher: { type: String, required: true },
    subject: { type: String, required: true },
    lecture: { type: Number, required: true, enum: [1, 2, 3, 4, 5, 6, 7] }
});

const timeTableSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    course: { type: String, required: true, lowercase: true },
    section: { type: String, required: true, lowercase: true },
    semester: { type: Number, required: true },
    timeSheet: [teachSubject]
});

async function run() {
    try {
        const conn = await mongoose.createConnection(REPORT_DB_URL).asPromise();
        console.log("Connected to REPORT DB");

        const TimeTable = conn.model('TimeTable', timeTableSchema);

        await TimeTable.deleteMany({ course: 'bca', section: { $in: ['a', 'a1'] } });

        const timeSheet = [
            // Monday
            { day: "Monday", teacher: "Prof. Sharma", subject: "Mathematics III", lecture: 1 },
            { day: "Monday", teacher: "Prof. Verma", subject: "C++ Programming", lecture: 2 },
            { day: "Monday", teacher: "Prof. Khan", subject: "Digital Electronics", lecture: 3 },
            { day: "Monday", teacher: "Prof. Singh", subject: "OS Theory", lecture: 4 },
            { day: "Monday", teacher: "Prof. Gupta", subject: "Soft Skills", lecture: 5 },
            { day: "Monday", teacher: "Prof. Verma", subject: "Lab: C++", lecture: 6 },
            { day: "Monday", teacher: "Prof. Sharma", subject: "Library", lecture: 7 },

            // Tuesday
            { day: "Tuesday", teacher: "Prof. Singh", subject: "Operating Systems", lecture: 1 },
            { day: "Tuesday", teacher: "Prof. Singh", subject: "OS Lab", lecture: 2 },
            { day: "Tuesday", teacher: "Prof. Gupta", subject: "DBMS Concepts", lecture: 3 },
            { day: "Tuesday", teacher: "Prof. Verma", subject: "Data Structures", lecture: 4 },
            { day: "Tuesday", teacher: "Prof. Mishra", subject: "Management", lecture: 5 },
            { day: "Tuesday", teacher: "Prof. Mishra", subject: "Economics", lecture: 6 },
            { day: "Tuesday", teacher: "Prof. Singh", subject: "Seminar", lecture: 7 },

            // Wednesday
            { day: "Wednesday", teacher: "Prof. Gupta", subject: "DBMS SQL", lecture: 1 },
            { day: "Wednesday", teacher: "Prof. Sharma", subject: "Mathematics III", lecture: 2 },
            { day: "Wednesday", teacher: "Prof. Khan", subject: "Dig. Elect. Lab", lecture: 3 },
            { day: "Wednesday", teacher: "Prof. Verma", subject: "Oops & C++", lecture: 4 },
            { day: "Wednesday", teacher: "Prof. Verma", subject: "C++ Programming", lecture: 5 },
            { day: "Wednesday", teacher: "Prof. Gupta", subject: "DBMS Lab", lecture: 6 },
            { day: "Wednesday", teacher: "Prof. Sharma", subject: "Tutorial", lecture: 7 },

            // Thursday
            { day: "Thursday", teacher: "Prof. Singh", subject: "Operating Systems", lecture: 1 },
            { day: "Thursday", teacher: "Prof. Verma", subject: "Data Structures", lecture: 2 },
            { day: "Thursday", teacher: "Prof. Sharma", subject: "Discrete Maths", lecture: 3 },
            { day: "Thursday", teacher: "Prof. Gupta", subject: "DBMS Lab", lecture: 4 },
            { day: "Thursday", teacher: "Thursday Class", subject: "Comm. Skills", lecture: 5 },
            { day: "Thursday", teacher: "Prof. Khan", subject: "Cyber Security", lecture: 6 },
            { day: "Thursday", teacher: "Prof. Mishra", subject: "Soft Skills", lecture: 7 },

            // Friday
            { day: "Friday", teacher: "Prof. Verma", subject: "C++ Programming", lecture: 1 },
            { day: "Friday", teacher: "Prof. Gupta", subject: "DBMS", lecture: 2 },
            { day: "Friday", teacher: "Prof. Sharma", subject: "Aptitude", lecture: 3 },
            { day: "Friday", teacher: "Prof. Verma", subject: "DS Lab", lecture: 4 },
            { day: "Friday", teacher: "Prof. Singh", subject: "Project Work", lecture: 5 },
            { day: "Friday", teacher: "Prof. Singh", subject: "Project Presentation", lecture: 6 },
            { day: "Friday", teacher: "Prof. Khan", subject: "Guest Lecture", lecture: 7 },

            // Saturday
            { day: "Saturday", teacher: "Prof. Khan", subject: "Workshop", lecture: 1 },
            { day: "Saturday", teacher: "Prof. Mishra", subject: "Extracurricular", lecture: 2 },
            { day: "Saturday", teacher: "Prof. Verma", subject: "Revision Class", lecture: 3 },
            { day: "Saturday", teacher: "Prof. Gupta", subject: "Doubt Clearing", lecture: 4 },
            { day: "Saturday", teacher: "Prof. Sharma", subject: "Placement Prep", lecture: 5 },
            { day: "Saturday", teacher: "Prof. Singh", subject: "Weekly Quiz", lecture: 6 },
            { day: "Saturday", teacher: "Prof. Khan", subject: "Mentoring", lecture: 7 },
        ];

        await TimeTable.create({
            userId: dummyUserId,
            course: "bca",
            section: "a",
            semester: 3,
            timeSheet: timeSheet
        });

        await TimeTable.create({
            userId: dummyUserId,
            course: "bca",
            section: "a1",
            semester: 3,
            timeSheet: timeSheet
        });

        console.log("Full COMPLETED Timetable Seeded Successfully for BCA Sections A and A1");
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

run();
