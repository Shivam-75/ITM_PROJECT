import { HostelRoom, HostelAllocation, HostelBlock, HostelFee } from "../models/hostelModel.model.js";

class HostelController {
    // Fees
    static async addFeeStructure(req, res) {
        try {
            const fee = await HostelFee.create(req.body);
            return res.status(201).json({ message: "Hostel fee structure added successfully", data: fee, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getFeeStructures(req, res) {
        try {
            const fees = await HostelFee.find().sort({ createdAt: -1 });
            return res.status(200).json({ fees, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteFeeStructure(req, res) {
        try {
            const { id } = req.params;
            await HostelFee.findByIdAndDelete(id);
            return res.status(200).json({ message: "Hostel fee structure removed", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Blocks
    static async addBlock(req, res) {
        try {
            const block = await HostelBlock.create(req.body);
            return res.status(201).json({ message: "Hostel block added successfully", data: block, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getBlocks(req, res) {
        try {
            const blocks = await HostelBlock.find();
            return res.status(200).json({ blocks, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Rooms
    static async addRoom(req, res) {
        try {
            const { block, roomNumber, type, floor, capacity } = req.body;
            const room = await HostelRoom.create({
                block, roomNumber, type, floor, capacity
            });
            // Increment room count and capacity in block
            await HostelBlock.findByIdAndUpdate(block, { $inc: { roomsCount: 1, capacity: capacity } });
            return res.status(201).json({ message: "Hostel room added successfully", data: room, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getRooms(req, res) {
        try {
            const rooms = await HostelRoom.find();
            return res.status(200).json({ rooms, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Allocations
    static async allocateRoom(req, res) {
        try {
            const { studentId, studentName, batch, block, room, joiningDate, emergencyContact, fee, status } = req.body;
            
            if (!studentId || !studentName || !batch || !block || !room || !joiningDate) {
                return res.status(400).json({ message: "Essential fields missing for allotment", status: 400 });
            }

            // Check if already allocated
            const existing = await HostelAllocation.findOne({ studentId, status: "Active" });
            if (existing) {
                return res.status(400).json({ message: "Student already has an active allotment", status: 400 });
            }

            const allocation = await HostelAllocation.create({
                studentId,
                studentName,
                batch,
                block,
                room,
                joiningDate,
                emergencyContact,
                fee,
                status: status || "Active"
            });

            // Update room and block occupancy
            await HostelRoom.findByIdAndUpdate(room, { $inc: { occupiedBeds: 1 } });
            await HostelBlock.findByIdAndUpdate(block, { $inc: { occupiedCapacity: 1 } });
            
            return res.status(201).json({ message: "Room allotted successfully", data: allocation, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllocations(req, res) {
        try {
            const allocations = await HostelAllocation.find().sort({ createdAt: -1 });
            return res.status(200).json({ allocations, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteAllocation(req, res) {
        try {
            const { id } = req.params;
            const allocation = await HostelAllocation.findById(id);
            if (!allocation) {
                return res.status(404).json({ message: "Allocation not found", status: 404 });
            }

            // Decrease room and block occupancy before deleting
            await HostelRoom.findByIdAndUpdate(allocation.room, { $inc: { occupiedBeds: -1 } });
            await HostelBlock.findByIdAndUpdate(allocation.block, { $inc: { occupiedCapacity: -1 } });

            await HostelAllocation.findByIdAndDelete(id);
            return res.status(200).json({ message: "Allocation removed successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }


}

export default HostelController;
