import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    batch: {
        type: String,
        required: true,
        trim: true
    },
    academicFee: {
        type: Number,
        default: 0
    },
    transportFee: {
        type: Number,
        default: 0
    },
    examinationFee: {
        type: Number,
        default: 0
    },
    uniformFee: {
        type: Number,
        default: 0
    },
    otherFee: {
        type: Number,
        default: 0
    },
    totalFee: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Pre-save hook to calculate totalFee
feeStructureSchema.pre("save", function(next) {
    this.totalFee = this.academicFee + this.transportFee + this.examinationFee + this.uniformFee + this.otherFee;
    next();
});

export const FeeStructure = mongoose.models.FeeStructure || mongoose.model("FeeStructure", feeStructureSchema);
