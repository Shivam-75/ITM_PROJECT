import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const StudentSchema = new mongoose.Schema({

    name: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    moNumber: { type: Number, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true, default: "SECTION A1" },
    batch: { type: String },
    stream: { type: String },
    passingYear: { type: String },
    caste: { type: String },
    gender: { type: String },
    board: { type: String },
    parentName: { type: String },
    parentMobile: { type: Number },
    motherName: { type: String },
    address: { type: String },
    studentId: { type: String },
    password: { type: String, required: false, default: "" },
    isBlock: { type: Boolean, default: false },
    image: { type: String, default: null },
    refreshtkn: { type: String, default: "1" },
    academicFee: { type: Number, default: 0 },
    isHostel: { type: Boolean, default: false },
    hostelFee: { type: Number, default: 0 },
    totalFee: { type: Number, default: 0 }
}, { timestamps: true })

StudentSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});

StudentSchema.methods.StudentAccessTokenGenerater = async function () {
    return jwt.sign({
        id: this._id,
        course: this.course,
        name: this.name,
        semester: this.semester,
        section: this.section
    }, process.env.STUDENT_ACCESS_TOKEN, { expiresIn: process.env.STUDENT_ACCESS_TOKEN_EXPIRY })
}

StudentSchema.methods.StudentRefreshTokenGenerater = async function () {
    return jwt.sign({
        id: this._id
    }, process.env.STUDENT_REFRESH_TOKEN, { expiresIn: process.env.STUDENT_REFRESH_TOKEN_EXPIRY })
}
export const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema, "students");