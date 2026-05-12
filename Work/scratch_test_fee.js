import mongoose from "mongoose";
import { config } from "dotenv";
import { FeeStructure } from "./src/admin/models/feeStructure.model.js";

config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to Work DB");
        
        const structures = await FeeStructure.find({});
        console.log(`Total structures in Work: ${structures.length}`);
        
        if (structures.length > 0) {
            console.log("Dumping all structures:");
            structures.forEach(s => {
                console.log(`- Dept: "${s.department}" | Course: "${s.course}" | Batch: "${s.batch}" | Total: ${s.totalFee}`);
            });
        } else {
            console.log("No fee structures found in DB.");
        }
        
        const search = {
            course: "BTECH CE",
            batch: "2026-2030"
        };
        
        const found = await FeeStructure.findOne({
            course: { $regex: new RegExp(`^${search.course}$`, 'i') },
            batch: { $regex: new RegExp(`^${search.batch}$`, 'i') }
        });
        
        console.log(`\nSpecific Search Result for ${search.course} / ${search.batch}:`);
        console.log(found ? JSON.stringify(found, null, 2) : "NOT FOUND");
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

test();
