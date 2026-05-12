import { Payment } from "../models/payment.model.js";

class PaymentController {
    static async recordPayment(req, res) {
        try {
            const { 
                studentId, studentName, course, semester, academicYear, 
                paymentType, amount, paymentMethod, transactionId, remark 
            } = req.body;

            const user = req.user; // From auth middleware

            if (!studentId || !studentName || !course || !semester || !academicYear || !paymentType || !amount) {
                return res.status(400).json({ message: "All mandatory fields are required", status: 400 });
            }

            const newPayment = await Payment.create({
                studentId,
                studentName,
                course,
                semester,
                academicYear,
                paymentType,
                amount,
                paymentMethod,
                transactionId,
                remark,
                receivedBy: user.id,
                receivedByName: user.name || "Faculty"
            });

            return res.status(201).json({ 
                message: `${paymentType} Fee Recorded Successfully !!`, 
                status: 201, 
                data: newPayment 
            });

        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    static async getPayments(req, res) {
        try {
            const { type, studentId } = req.query;
            let query = {};
            if (type) query.paymentType = type;
            if (studentId) query.studentId = studentId;

            const payments = await Payment.find(query).sort({ createdAt: -1 });
            return res.status(200).json({ payments, status: 200 });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    static async getMyCollection(req, res) {
        try {
            const userId = req.user.id;
            const payments = await Payment.find({ receivedBy: userId }).sort({ createdAt: -1 });
            return res.status(200).json({ payments, status: 200 });
        } catch (error) {
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default PaymentController;
