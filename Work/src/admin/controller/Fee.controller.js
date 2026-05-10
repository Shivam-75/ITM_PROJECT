import { FeeStructure, FeePayment } from "../models/feeModel.model.js";

class FeeController {
    // Fee Structure
    static async addFeeStructure(req, res) {
        try {
            const structure = await FeeStructure.create(req.body);
            return res.status(201).json({ message: "Fee structure added successfully", data: structure, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getFeeStructures(req, res) {
        try {
            const structures = await FeeStructure.find();
            return res.status(200).json({ structures, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Fee Payments
    static async recordPayment(req, res) {
        try {
            const payment = await FeePayment.create(req.body);
            return res.status(201).json({ message: "Payment recorded successfully", data: payment, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getPayments(req, res) {
        try {
            const payments = await FeePayment.find().sort({ createdAt: -1 });
            return res.status(200).json({ payments, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default FeeController;
