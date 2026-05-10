import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModels.model.js";

class AdminVerifation {
    static async TokenVerification(req, res, next) {
        try {

            const token =
                req.cookies?.adminAccessToken ||
                (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1])

            if (!token) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 });
            }

            const tokenDecreapt = await jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECREAT);

            const searchUser = await Admin.findById(tokenDecreapt.id).select("-password  -refreshtkn")

            if (!searchUser) {
                return res.status(403).json({ message: "User not Found !!", status: 403 });
            }

            req.adminData = searchUser;
            next();
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }
    static async RoleVerifation(req, res, next) {
        const user = req.adminData;
        try {
            if (!user.superAdmin) {
                return res.status(400).json({ message: "unAuthorize Access not Admin !!", status: 200 });
            }
            next();
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }
}
export default AdminVerifation;