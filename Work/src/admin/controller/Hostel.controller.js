import { HostelRoom, HostelAllocation, HostelComplaint } from "../models/hostelModel.model.js";

class HostelController {
    // Rooms
    static async addRoom(req, res) {
        try {
            const room = await HostelRoom.create(req.body);
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
            const { studentName, course, roomNo, block, bed, studentId } = req.body;
            
            // Check if already allocated
            const existing = await HostelAllocation.findOne({ roomNo, block, bed, status: "Active" });
            if (existing) {
                return res.status(400).json({ message: "This bed is already occupied", status: 400 });
            }

            const allocation = await HostelAllocation.create({
                studentName, course, roomNo, block, bed, studentId
            });

            // Update room occupancy
            await HostelRoom.findOneAndUpdate({ roomNo, block }, { $inc: { occupied: 1 } });
            
            return res.status(201).json({ message: "Room allocated successfully", data: allocation, status: 201 });
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

            // Decrease room occupancy before deleting
            await HostelRoom.findOneAndUpdate(
                { roomNo: allocation.roomNo, block: allocation.block }, 
                { $inc: { occupied: -1 } }
            );

            await HostelAllocation.findByIdAndDelete(id);
            return res.status(200).json({ message: "Allocation removed successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    // Complaints
    static async addComplaint(req, res) {
        try {
            const complaint = await HostelComplaint.create(req.body);
            return res.status(201).json({ message: "Complaint registered successfully", data: complaint, status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getComplaints(req, res) {
        try {
            const complaints = await HostelComplaint.find().sort({ createdAt: -1 });
            return res.status(200).json({ complaints, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default HostelController;
