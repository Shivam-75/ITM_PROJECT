import mongoose from "mongoose";
import { config } from "dotenv";

config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to Work DB");
        
        const count = await mongoose.connection.db.collection("feestructures").countDocuments();
        console.log(`Documents in feestructures: ${count}`);
        
        if (count > 0) {
            const docs = await mongoose.connection.db.collection("feestructures").find({}).toArray();
            console.log(JSON.stringify(docs, null, 2));
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

test();
