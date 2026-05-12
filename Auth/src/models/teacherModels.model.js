import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    password: { type: String },
    email: { type: String, lowercase: true },
    department: [{ type: String, uppercase: true }],
    moNumber: { type: Number, required: true },
    age: { type: Number },
    gender: { type: String },
    address: { type: String },
    qualification: { type: String },
    higherQualification: { type: String },
    fatherName: { type: String },
    aadhaar: { type: String },
    dob: { type: String },
    doj: { type: String },
    maritalStatus: { type: String },
    image: { type: String, default: "" },
    employeeId: { type: String, lowercase: true },
    specialization: { type: String },
    experience: { type: String },
    salary: { type: Number, default: null },
    bankAccount: { type: String, default: "" },
    role: { type: String, default: "Faculty" },
    isFaculty: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    refreshtkn: { type: String, default: "1" },
    permissions: [{ type: Object }],
    roleName: { type: String },
    sections: [{ type: String }],
    semesters: [{ type: String }]
}, { timestamps: true })

TeacherSchema.pre("save", async function () {
    if (!this.password) return; // Skip hashing if password is blank
    this.password = await bcrypt.hash(this.password, 10);
});


TeacherSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

TeacherSchema.methods.AccessTokenGenerater = async function () {
    return jwt.sign({
        id: this._id,
        department: this.department,
        role: this.role,
        name: this.name,
        isFaculty: this.isFaculty
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN })
}

TeacherSchema.methods.RefreshTokenGenerater = async function () {
    return jwt.sign({
        id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN })
}
export const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema, "teachers");