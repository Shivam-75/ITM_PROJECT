import { Notification } from "../models/notification.model.js";

class NotificationController {
    static async createNotification(req, res) {
        try {
            const { title, message, type, recipientType, recipientValue, sender, link } = req.body;

            if (!title || !message || !type || !recipientType || !recipientValue || !sender) {
                return res.status(400).json({ message: "Fill all required fields", status: 400 });
            }

            const notification = await Notification.create({
                title,
                message,
                type,
                recipientType,
                recipientValue,
                sender,
                link
            });

            return res.status(201).json({
                message: "Notification created successfully",
                status: 201,
                data: notification
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getNotificationsForUser(req, res) {
        try {
            const { section, course, userId } = req.query;

            // Find notifications where recipient matches user's section, course, or is 'All'
            const notifications = await Notification.find({
                $or: [
                    { recipientType: "All" },
                    { recipientType: "Section", recipientValue: section },
                    { recipientType: "Course", recipientValue: course },
                    { recipientType: "Individual", recipientValue: userId }
                ]
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                message: "Notifications fetched successfully",
                status: 200,
                data: notifications
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async markAsRead(req, res) {
        try {
            const { notificationId, userId } = req.body;
            await Notification.findByIdAndUpdate(notificationId, {
                $addToSet: { readBy: userId }
            });
            return res.status(200).json({ message: "Notification marked as read", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default NotificationController;
