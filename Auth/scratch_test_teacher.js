import mongoose from "mongoose";
import { config } from "dotenv";
import { Teacher } from "./src/models/teacherModels.model.js";

config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to MongoDB");

        const teachers = await Teacher.find().limit(5);
        console.log("Sample Teachers:", JSON.stringify(teachers, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

test();
