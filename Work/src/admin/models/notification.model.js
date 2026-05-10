import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    recipientType: {
        type: String,
        enum: ["All", "Section", "Individual", "Course"],
        required: true
    },
    recipientValue: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    link: {
        type: String
    }
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema, "notifications");
