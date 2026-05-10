import jwt from "jsonwebtoken";
import axios from "axios";

class StudentAccessChecker {
    static async userVerification(req, res, next) {
        try {
            const { studentAccessToken } = req.cookies;

            if (!studentAccessToken) {
                return res.status(401).json({
                    message: "Unauthorized access",
                    status: 401,
                });
            }

            try {
                jwt.verify(studentAccessToken, process.env.STUDENT_ACCESS_TOKEN);
            } catch (err) {
                return res.status(401).json({
                    message: "Invalid or Expired Token !!",
                    status: 401,
                });
            }

            // Fetch full profile from Auth Microservice
            const { data } = await axios.get(`${process.env.AUTH_MICROSERVICESS_URL}${process.env.AUTH_STUDENT_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${studentAccessToken}`
                },
                withCredentials: true
            });

            if (!data.StudentData) {
                return res.status(404).json({ message: "User profile not found", status: 404 });
            }

            req.students = data.StudentData;
            next();

        } catch (err) {
            console.error("Auth Middleware Error:", err.message);
            return res.status(500).json({
                message: "Internal server error during authentication",
                status: 500,
            });
        }
    }
}

export default StudentAccessChecker;
