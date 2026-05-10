import mongoose from "mongoose";
import { config } from "dotenv";

config();

const testDb = async () => {
    try {
        const url = process.env.MONGO_DB_URL?.trim();
        console.log("Connecting to:", url.substring(0, 30) + "...");
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("SUCCESS: Database Connected");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Database Connection Error:", err.message);
        process.exit(1);
    }
};

testDb();
