import mongoose from "mongoose";

const Db = async () => {
  try {

    const connection = await mongoose.connect(process.env.MONGO_DB_URL)
    if (!connection) {
      console.error("❌ Database Error: MONGO_DB_URL is not defined in .env");
      return;
    }

    console.log("📡 Database Connected:", connection?.connection?.host);
  } catch (err) {
    console.error("❌ Database Error:", err.message);
  }
};

export default Db;
