import { Router } from "express";
import NotificationController from "../controller/Notification.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const notificationRoute = Router();

notificationRoute.route("/create").post(AdminVerifation.TokenVerification, NotificationController.createNotification);
notificationRoute.route("/user-notifications").get(NotificationController.getNotificationsForUser);
notificationRoute.route("/mark-read").post(NotificationController.markAsRead);
