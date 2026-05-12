import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const dropAdminIdIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collection = db.collection("admins");

        const indexes = await collection.indexes();
        console.log("Current indexes:", indexes);

        const hasAdminIdIndex = indexes.some(idx => idx.name === "adminId_1");
        
        if (hasAdminIdIndex) {
            await collection.dropIndex("adminId_1");
            console.log("Successfully dropped adminId_1 index");
        } else {
            console.log("adminId_1 index not found");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
};

dropAdminIdIndex();
