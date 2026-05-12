import { Router } from "express";
import PaymentController from "../controller/Payment.controller.js";
import authorizeAccessChecker from "../../teacher/middleware/authChecker.js";

export const paymentRoute = Router();

// Allow both Admin and Teacher (using the teacher middleware as it works for both if the token is valid)
paymentRoute.route("/record").post(authorizeAccessChecker.userVerification, PaymentController.recordPayment);
paymentRoute.route("/history").get(authorizeAccessChecker.userVerification, PaymentController.getPayments);
paymentRoute.route("/my-collection").get(authorizeAccessChecker.userVerification, PaymentController.getMyCollection);
