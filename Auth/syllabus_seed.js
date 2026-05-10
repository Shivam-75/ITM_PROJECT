import mongoose from 'mongoose';

const WORK_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/WORKMICROSERVICESS";

const syllabusSchema = new mongoose.Schema({
    course: { type: String, lowercase: true },
    year: Number,
    title: String,
    fileUrl: String
}, { timestamps: true });

async function run() {
    try {
        const conn = await mongoose.createConnection(WORK_DB_URL).asPromise();
        console.log("Connected to WORK DB");

        const Syllabus = conn.models.Syllabus || conn.model('Syllabus', syllabusSchema);

        await Syllabus.deleteMany({ course: 'bca', year: 1 });

        const bca1stYearSyllabus = [
            { title: "BCA 101: Programming in C", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 102: Mathematics - I", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 103: Computer Fundamentals & IT", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 104: Technical Communication", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 201: Data Structures using C", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 202: Mathematics - II", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            { title: "BCA 203: Digital Electronics", fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
        ];

        const entries = bca1stYearSyllabus.map(item => ({
            ...item,
            course: "bca",
            year: 1
        }));

        await Syllabus.insertMany(entries);

        console.log("BCA 1st Year Syllabus Seeded Successfully");
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

run();
