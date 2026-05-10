import mongoose from "mongoose";

const hostelRoomSchema = new mongoose.Schema({
    block: { type: mongoose.Schema.Types.ObjectId, required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, required: true },
    floor: { type: String, required: true },
    capacity: { type: Number, required: true },
    occupiedBeds: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Maintenance", "Full"], default: "Active" }
}, { timestamps: true });

const hostelAllocationSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    batch: { type: String, required: true },
    block: { type: mongoose.Schema.Types.ObjectId, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, required: true },
    joiningDate: { type: Date, required: true },
    emergencyContact: { type: String },
    status: { type: String, default: "Active" },
    fee: { type: Number, default: 0 }
}, { timestamps: true });

const hostelComplaintSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    complaint: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" }
}, { timestamps: true });

const hostelBlockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["Boys", "Girls"], required: true },
    capacity: { type: Number, required: true },
    roomsCount: { type: Number, required: true },
    occupiedCapacity: { type: Number, default: 0 },
    occupiedRooms: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Full", "Maintenance"], default: "Active" }
}, { timestamps: true });

const hostelFeeSchema = new mongoose.Schema({
    roomType: { type: String, required: true },
    hostelType: { type: String, enum: ["Boys", "Girls"], required: true },
    amount: { type: Number, required: true },
    academicYear: { type: String, required: true },
    description: { type: String, default: "" }
}, { timestamps: true });

export const HostelFee = mongoose.models.HostelFee || mongoose.model("HostelFee", hostelFeeSchema, "hostelfees");
export const HostelBlock = mongoose.models.HostelBlock || mongoose.model("HostelBlock", hostelBlockSchema, "hostelblocks");
export const HostelRoom = mongoose.models.HostelRoom || mongoose.model("HostelRoom", hostelRoomSchema, "hostelrooms");
export const HostelAllocation = mongoose.models.HostelAllocation || mongoose.model("HostelAllocation", hostelAllocationSchema, "hostelallotments");
export const HostelComplaint = mongoose.models.HostelComplaint || mongoose.model("HostelComplaint", hostelComplaintSchema, "hostelcomplaints");
