import jwt from "jsonwebtoken";

class GlobalAccessChecker {
    static async viewOnly(req, res, next) {
        try {
            const { adminAccessToken, teacherAccessToken, studentAccessToken } = req.cookies;

            if (adminAccessToken) {
                try {
                    const decoded = jwt.verify(adminAccessToken, process.env.ADMIN_ACCESS_TOKEN_SECREAT);
                    if (decoded) {
                        req.admin = decoded;
                        return next();
                    }
                } catch (err) {
                    // Continue to check other tokens if admin token is invalid
                }
            }

            if (teacherAccessToken) {
                try {
                    const decoded = jwt.verify(teacherAccessToken, process.env.ACCESS_TOKEN_SECRET);
                    if (decoded) {
                        req.teacher = decoded;
                        return next();
                    }
                } catch (err) {
                    // Continue
                }
            }

            if (studentAccessToken) {
                try {
                    const decoded = jwt.verify(studentAccessToken, process.env.STUDENT_ACCESS_TOKEN);
                    if (decoded) {
                        req.student = decoded;
                        return next();
                    }
                } catch (err) {
                    // Continue
                }
            }

            return res.status(401).json({
                message: "Unauthorized: Please login to access registry",
                status: 401
            });

        } catch (err) {
            return res.status(500).json({ message: "Internal server error during authorization", status: 500 });
        }
    }
}

export default GlobalAccessChecker;
