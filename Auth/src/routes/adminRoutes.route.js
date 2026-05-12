import { Router } from "express";
import AdminController from "../controller/adminControllers.controller.js";
import AdminVerifation from "../middleware/adminVerication.js";


export const AdminRoutes = Router();

AdminRoutes.route("/registration").post(AdminController.AdminRegistration);
AdminRoutes.route("/login").post(AdminController.adminLogin).get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.adminProfile);
AdminRoutes.route("/logout").patch(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.adminLogout);
AdminRoutes.route("/refreshToken").post(AdminVerifation.TokenVerification, AdminController.adminRefreshToken);
AdminRoutes.route("/TeacherList").get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.TeacherList);
AdminRoutes.route("/StudentList").get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.StudentList);
AdminRoutes.route("/StudentList/Deleted/:id").delete(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.StudentDelete);
AdminRoutes.route("/TeacherList/Deleted/:id").delete(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.TeacherDelete);
AdminRoutes.route("/AdminList").get(AdminVerifation.TokenVerification, AdminController.AdminList);
AdminRoutes.route("/AdminList/Deleted/:id").delete(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.AdminDelete);

// 🔹 Faculty Management (Profile Based)
import { upload } from "../middleware/multer.js";
AdminRoutes.route("/Faculty/add").post(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, upload.single("image"), AdminController.FacultyRegistration);
AdminRoutes.route("/Faculty/get/:id").get(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, AdminController.GetFacultyProfile);
AdminRoutes.route("/Faculty/update/:id").put(AdminVerifation.TokenVerification, AdminVerifation.RoleVerifation, upload.single("image"), AdminController.FacultyUpdate);
