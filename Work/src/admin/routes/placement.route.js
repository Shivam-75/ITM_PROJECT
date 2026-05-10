import { Router } from "express";
import PlacementController from "../controller/Placement.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";

export const placementRoute = Router();

// Drive Management
placementRoute.route("/drives").get(PlacementController.getPlacements).post(AdminVerifation.TokenVerification, PlacementController.createPlacement);

// Application Management
placementRoute.route("/apply").post(PlacementController.applyForPlacement);
placementRoute.route("/applications").get(PlacementController.getApplications);
placementRoute.route("/applications/:id").patch(AdminVerifation.TokenVerification, PlacementController.updateApplicationStatus);
