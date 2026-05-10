import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    department: {
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
    topic: {
        type: String,
        required: true
    }
}, { timestamps: true });


export const Link = mongoose.model("link", linksSchema);