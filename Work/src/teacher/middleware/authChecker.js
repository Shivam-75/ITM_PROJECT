import jwt from "jsonwebtoken";

class authorizeAccessChecker {
    static async userVerification(req, res, next) {
        try {
            const { teacherAccessToken } = req.cookies;

            // 🔹 Token Missing
            if (!teacherAccessToken) {
                return res.status(401).json({
                    message: "Unauthorized: Token missing",
                    status: 401,
                });
            }

            // 🔹 Verify Token
            const tokenDecreapt = jwt.verify(
                teacherAccessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!tokenDecreapt) {
                return res.status(401).json({
                    message: "Access Denied Token Expire !!",
                    status: 401,
                });
            }

            // 🔹 Attach user data to request
            req.user = tokenDecreapt;

            next();
        } catch (error) {

            // 🔹 Token Expired
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Token Expired !! Please login again",
                    status: 401,
                });
            }

            // 🔹 Invalid Token
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Invalid Token !!",
                    status: 401,
                });
            }

            // 🔹 Server Error
            return res.status(500).json({
                message: "Internal server error",
                status: 500,
            });
        }
    }
}

export default authorizeAccessChecker;
