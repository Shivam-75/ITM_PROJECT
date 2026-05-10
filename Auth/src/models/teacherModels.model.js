import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true,
        lowercase: true

    },
    moNumber: {
        type: Number,
        required: true,

    },
    role: {
        type: String,
        enum: ['admin', 'faculty'],
        lowercase: true,
        default: "faculty"
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        lowercase: true
    },
    isFaculty: {
        type: Boolean,
        default: true
    },

    isBlock: {
        type: Boolean,
        default: false
    },
    refreshtkn: {
        type: String,
        default: "1"
    }
}, { timestamps: true })

TeacherSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});


TeacherSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

TeacherSchema.methods.AccessTokenGenerater = async function () {
    return jwt.sign({
        id: this._id,
        course: this.course,
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
export const Teacher = new mongoose.model("Teacher", TeacherSchema);