import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    department: { type: String, required: true, lowercase: true },
    age: { type: Number },
    gender: { type: String, lowercase: true },
    address: { type: String },
    qualification: { type: String },
    higherQualification: { type: String },
    fatherName: { type: String },
    aadhaar: { type: String },
    dob: { type: String },
    doj: { type: String },
    maritalStatus: { type: String },
    phone: { type: String },
    email: { type: String, lowercase: true, unique: true },
    image: { type: String }, // URL to image
    isBlock: { type: Boolean, default: false }
}, { timestamps: true });

export const Staff = mongoose.model("Staff", staffSchema);
