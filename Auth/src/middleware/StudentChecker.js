import jwt from "jsonwebtoken"
import { Student } from "../models/studentModels.model.js";

class StudentAccessChecker {
    static async userVerification(req, res, next) {
        try {
            const token =
                req.cookies?.studentAccessToken ||
                (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1])

            if (!token) {
                return res.status(401).json({ message: "Unauthorized access" });
            }


            let decoded;
            try {
                decoded = jwt.verify(token, process.env.STUDENT_ACCESS_TOKEN);
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({ status: 403, message: "Token expired" });
                }
                return res.status(403).json({ status: 403, message: "Invalid token" });
            }

            if (!decoded) {
                return res.status(401).json({ message: "Unauthorized access", status: 401 });
            }

            req.students = decoded;
            next();

        } catch (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default StudentAccessChecker;