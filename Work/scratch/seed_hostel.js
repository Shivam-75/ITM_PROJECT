import mongoose from "mongoose";
import { HostelRoom, HostelAllocation } from "../src/admin/models/hostelModel.model.js";
import { config } from "dotenv";

// Load environment variables
config();

const MONGO_URI = process.env.MONGO_DB_URL || "mongodb+srv://shivampandey:shivampandey@mern.kztl1s8.mongodb.net/MicroservicessWork";

const seedHostel = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected Successfully.");

        // Clear existing rooms and allocations to start fresh
        console.log("Cleaning up existing hostel data...");
        await HostelRoom.deleteMany({});
        await HostelAllocation.deleteMany({});

        const rooms = [
            // Block A
            { roomNo: "101", block: "A", capacity: 2, type: "Non-AC", price: 65000 },
            { roomNo: "102", block: "A", capacity: 2, type: "Non-AC", price: 65000 },
            { roomNo: "103", block: "A", capacity: 2, type: "AC", price: 85000 },
            // Block B
            { roomNo: "201", block: "B", capacity: 2, type: "Non-AC", price: 65000 },
            { roomNo: "202", block: "B", capacity: 2, type: "AC", price: 85000 },
            { roomNo: "203", block: "B", capacity: 2, type: "AC", price: 85000 },
            // Block C
            { roomNo: "301", block: "C", capacity: 2, type: "Non-AC", price: 65000 },
            { roomNo: "302", block: "C", capacity: 2, type: "Non-AC", price: 65000 },
        ];

        console.log("Seeding Hostel Rooms...");
        await HostelRoom.insertMany(rooms);

        console.log("Hostel Seeding Complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedHostel();
