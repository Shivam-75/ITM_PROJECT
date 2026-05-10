import mongoose from "mongoose";
import { StudentProfile } from "../src/admin/models/studentProfile.models.js";
import { Staff } from "../src/admin/models/staffModel.model.js";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config();

const MONGO_URI = process.env.MONGO_DB_URL || "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/MicroservicessWork";

const seedData = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected Successfully.");

        // Clear existing demo data (optional, but safer for re-runs)
        // await StudentProfile.deleteMany({ name: { $regex: /Demo Student/i } });
        // await Staff.deleteMany({ name: { $regex: /Demo Professor/i } });

        const demoStudents = [
            {
                name: "Aarav Sharma",
                course: "BCA",
                year: "2024",
                semester: 1,
                moNumber: 9876543210,
                studentId: "STU001",
                parentName: "Rajesh Sharma",
                address: "New Delhi, India"
            },
            {
                name: "Ishita Verma",
                course: "MCA",
                year: "2023",
                semester: 3,
                moNumber: 9988776655,
                studentId: "STU002",
                parentName: "Sanjay Verma",
                address: "Mumbai, Maharashtra"
            },
            {
                name: "Kabir Singh",
                course: "BCA",
                year: "2024",
                semester: 2,
                moNumber: 9123456789,
                studentId: "STU003",
                parentName: "Harbhajan Singh",
                address: "Chandigarh, Punjab"
            }
        ];

        const demoStaff = [
            {
                name: "Dr. Alok Nath",
                department: "Computer Science",
                email: "alok.nath@itm.edu",
                phone: "9870001122",
                aadhaar: "123456789012",
                qualification: "Ph.D. in AI",
                higherQualification: "Post Doc",
                gender: "male",
                doj: "2020-08-15",
                image: "/faculty/demo1.jpg"
            },
            {
                name: "Prof. Meera Iyer",
                department: "Management",
                email: "meera.iyer@itm.edu",
                phone: "9870003344",
                aadhaar: "987654321098",
                qualification: "MBA, PhD",
                higherQualification: "NET Qualified",
                gender: "female",
                doj: "2021-01-10",
                image: "/faculty/demo2.jpg"
            },
            {
                name: "Dr. Vikram Seth",
                department: "Mathematics",
                email: "vikram.seth@itm.edu",
                phone: "9870005566",
                aadhaar: "112233445566",
                qualification: "M.Sc, PhD",
                higherQualification: "Gold Medalist",
                gender: "male",
                doj: "2019-12-01",
                image: "/faculty/demo3.jpg"
            }
        ];

        console.log("Seeding Students...");
        for (const stu of demoStudents) {
            await StudentProfile.findOneAndUpdate({ studentId: stu.studentId }, stu, { upsert: true });
        }

        console.log("Seeding Staff...");
        for (const staff of demoStaff) {
            await Staff.findOneAndUpdate({ email: staff.email }, staff, { upsert: true });
        }

        console.log("Seeding Complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedData();
