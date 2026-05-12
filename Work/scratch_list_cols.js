import mongoose from "mongoose";
import { config } from "dotenv";

config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to Work DB");
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in DB:");
        collections.forEach(c => console.log(`- ${c.name}`));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

test();
