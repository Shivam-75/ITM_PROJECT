import mongoose from "mongoose";

const Db = async () => {
    try {
        const url = process.env.MONGO_DB_URL?.trim();
        if (!url) {
            throw new Error("MONGO_DB_URL is not defined in .env");
        }

        // Mask URI for logs (showing only the beginning and the cluster name)
        const maskedUrl = url.replace(/\/\/.*@/, "//****:****@");
        console.log(`📡 Attempting Database Connection...`);

        const conn = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ Database Connected: ${conn.connection.host} / ${conn.connection.name}`);
    } catch (err) {
        console.error("❌ Database Connection Critical Failure:", err.message);
        // Important: Re-throw to stop the main process from starting in a broken state
        throw err;
    }
};

export default Db;
