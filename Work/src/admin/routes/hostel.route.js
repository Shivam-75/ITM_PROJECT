import { Router } from "express";
import HostelController from "../controller/Hostel.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const hostelRoute = Router();

hostelRoute.use(AdminVerifation.TokenVerification);

hostelRoute.route("/fees").get(HostelController.getFeeStructures).post(HostelController.addFeeStructure);
hostelRoute.route("/fees/:id").delete(HostelController.deleteFeeStructure);
hostelRoute.route("/blocks").get(HostelController.getBlocks).post(HostelController.addBlock);
hostelRoute.route("/rooms").get(HostelController.getRooms).post(HostelController.addRoom);
hostelRoute.route("/allocate").get(HostelController.getAllocations).post(HostelController.allocateRoom);
hostelRoute.route("/allocate/:id").delete(HostelController.deleteAllocation);
