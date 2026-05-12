import { Router } from "express";
import AdminController from "../controller/adminControllers.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";


export const AdminRoutes = Router();

AdminRoutes.route("/registration").post(AdminController.AdminRegistration);
AdminRoutes.route("/registration/next-id").get(AdminController.GetNextAdminId);
AdminRoutes.route("/login").post(AdminController.adminLogin).get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.adminProfile);
AdminRoutes.route("/logout").patch(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.adminLogout);
AdminRoutes.route("/refreshToken").post(AdminVerifation.TokenVerification, AdminController.adminRefreshToken);
AdminRoutes.route("/TeacherList").get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.TeacherList);
AdminRoutes.route("/StudentList").get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.StudentList);
AdminRoutes.route("/StudentList/Deleted/:id").delete(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.StudentDelete);
AdminRoutes.route("/TeacherList/Deleted/:id").delete(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.TeacherDelete);
