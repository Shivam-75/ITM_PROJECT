import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const StudentSchema = new mongoose.Schema({

    name: { type: String, required: true, lowercase: true },
    course: { type: String, required: true, lowercase: true },
    year: { type: String, required: true },
    moNumber: { type: Number, required: true },
    gender: { type: String, lowercase: true },
    password: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true, lowercase: true, default: "section a1" },
    isBlock: { type: Boolean, default: false },
    refreshtkn: { type: String, default: "1" }
}, { timestamps: true })

StudentSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

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
export const Student = new mongoose.model("Student", StudentSchema);