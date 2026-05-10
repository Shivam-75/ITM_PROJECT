import mongoose from 'mongoose';

const WORK_DB_URL = "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/WORKMICROSERVICESS";
const dummyUserId = "60d5ecb3e4b0c84d1c8e1e1e";

const assignmentSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    subject: { type: String, lowercase: true },
    semester: { type: String, lowercase: true },
    section: String,
    year: Number,
    department: { type: String, lowercase: true },
    questions: [String]
}, { timestamps: true });

async function run() {
    try {
        const conn = await mongoose.createConnection(WORK_DB_URL).asPromise();
        console.log("Connected to WORK DB");

        const Assignment = conn.models.Assignmnet || conn.model('Assignmnet', assignmentSchema);

        await Assignment.deleteMany({ department: 'bca' });

        await Assignment.create([
            {
                userId: new mongoose.Types.ObjectId(dummyUserId),
                department: "bca",
                semester: "3",
                year: 2,
                section: "a1",
                subject: "Web Development",
                questions: [
                    "Build a Portfolio using React",
                    "Implement JWT Authentication in Node.js",
                    "Design a Responsive Landing Page",
                    "Connect Frontend to MongoDB via Express",
                    "Deploy the application on Vercel or Heroku"
                ]
            },
            {
                userId: new mongoose.Types.ObjectId(dummyUserId),
                department: "bca",
                semester: "3",
                year: 2,
                section: "a1",
                subject: "Database Management",
                questions: [
                    "Design an E-R Diagram for a Library System",
                    "Normalize the database to 3NF",
                    "Write SQL queries for complex joins",
                    "Implement stored procedures for data auditing",
                    "Create indexes to optimize search queries"
                ]
            }
        ]);

        console.log("Assignments RE-SEEDED Successfully for BCA A1 with 5 questions each");
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Seeding Failed:", err);
        process.exit(1);
    }
}

run();
