import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
    courseName: { type: String, required: true, lowercase: true },
    academicFee: { type: Number, required: true },
    examinationFee: { type: Number },
    uniformFee: { type: Number },
    transportFee: { type: Number },
    hostelFee: { type: Number }
}, { timestamps: true });

export const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

const feePaymentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String },
    course: { type: String },
    semester: { type: Number },
    amountPaid: { type: Number, required: true },
    transactionId: { type: String, unique: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Success", "Pending", "Failed"], default: "Success" }
}, { timestamps: true });

export const FeePayment = mongoose.model("FeePayment", feePaymentSchema);
