import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    linkas: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Link = mongoose.models.Link || mongoose.model("Link", linksSchema, "links");