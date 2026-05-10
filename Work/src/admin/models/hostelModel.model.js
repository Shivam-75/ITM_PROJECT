import mongoose from "mongoose";

const hosteRoomSchema = new mongoose.Schema({
    roomNo: { type: String, required: true, unique: true },
    block: { type: String, default: "A" }, // Added Block support
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    type: { type: String, enum: ["AC", "Non-AC"], default: "Non-AC" },
    price: { type: Number }
}, { timestamps: true });

export const HostelRoom = mongoose.model("HostelRoom", hosteRoomSchema);

const hostelAllocationSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String },
    course: { type: String }, // Added Course
    roomNo: { type: String, required: true },
    block: { type: String }, // Added Block
    bed: { type: String }, // Added Bed
    joiningDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Left"], default: "Active" }
}, { timestamps: true });

export const HostelAllocation = mongoose.model("HostelAllocation", hostelAllocationSchema);

const hostelComplaintSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String },
    roomNo: { type: String },
    category: { type: String }, // e.g., "Electricity", "Plumbing"
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "In-Progress", "Resolved"], default: "Pending" }
}, { timestamps: true });

export const HostelComplaint = mongoose.model("HostelComplaint", hostelComplaintSchema);
