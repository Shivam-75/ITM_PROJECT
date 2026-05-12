import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    studentId: { type: String, required: true }, // Roll No / User ID
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    
    paymentType: { 
        type: String, 
        enum: ["Academic", "Hostel"], 
        required: true 
    },
    
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Online", "Bank Transfer"], default: "Cash" },
    transactionId: { type: String }, // For online/bank
    
    receivedBy: { type: mongoose.Schema.Types.ObjectId, required: true }, // Faculty/Admin ID
    receivedByName: { type: String, required: true },
    
    remark: { type: String },
    status: { type: String, enum: ["Success", "Pending", "Failed"], default: "Success" }
}, { timestamps: true });

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema, "payments");
