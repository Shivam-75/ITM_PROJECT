import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true,
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    mobNumber: {
        type: Number,
        require: true
    },
    refreshtkn: {
        type: String,
        default: "1"
    }

})

AdminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 15);
});

AdminSchema.methods.adminAccessToken = async function () {
    return jwt.sign({
        id: this._id,
    }, process.env.ADMIN_ACCESS_TOKEN_SECREAT, { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY })
}

AdminSchema.methods.adminRefreshToken = async function () {
    return jwt.sign({
        id: this._id
    }, process.env.ADMIN_REFRESH_TOKEN_SECREAT, { expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY })
}

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema, "admins");