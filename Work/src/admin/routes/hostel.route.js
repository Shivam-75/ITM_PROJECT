import { Router } from "express";
import HostelController from "../controller/Hostel.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const hostelRoute = Router();

hostelRoute.use(AdminVerifation.TokenVerification);

hostelRoute.route("/rooms").get(HostelController.getRooms).post(HostelController.addRoom);
hostelRoute.route("/allocate").get(HostelController.getAllocations).post(HostelController.allocateRoom);
hostelRoute.route("/allocate/:id").delete(HostelController.deleteAllocation);
hostelRoute.route("/complaints").get(HostelController.getComplaints).post(HostelController.addComplaint);
