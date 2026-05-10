import { Teacher } from "../models/teacherModels.model.js";
import jwt from "jsonwebtoken"

class authorizeAccessChecker {
    static async userVerification(req, res, next) {
        try {
            const teacherAccessToken = req.cookies?.teacherAccessToken || req.header("Authorization")?.replace("Bearer ", "");

            if (!teacherAccessToken) {
                return res.status(401).json({ message: "Unauthorized access" });
            }

            let decoded;
            try {
                decoded = jwt.verify(teacherAccessToken, process.env.ACCESS_TOKEN_SECRET);
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({ status: 403, message: "Token expired" });
                }
                return res.status(403).json({ status: 403, message: "Invalid token" });
            }

            if (!decoded) {
                return res.status(404).json({ message: "User not found" });
            }

            if (decoded.isFaculty !== true) {
                return res.status(403).json({ status: 403, message: "Unauthorized access" });
            }


            req.user = decoded;
            next();

        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default authorizeAccessChecker;