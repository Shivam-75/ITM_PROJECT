import axios from "axios";
import jwt from "jsonwebtoken";
import fs from "fs";

class AdminVerifation {
    static async TokenVerification(req, res, next) {
        try {
            const { adminAccessToken } = req.cookies;
            const logMsg = `[${new Date().toISOString()}] AUTH_CHECK: path=${req.path}, hasToken=${!!adminAccessToken}, contentType=${req.headers["content-type"]}\n`;
            fs.appendFileSync("upload_debug.log", logMsg);

            if (!adminAccessToken) {
                return res.status(401).json({ message: "unAuthorize Access !!", status: 401 });
            }

            const tokenDecreapt = await jwt.verify(adminAccessToken, process.env.ADMIN_ACCESS_TOKEN_SECREAT);


            if (!tokenDecreapt) {
                return res.status(401).json({ message: "Access Denied Token Expire !!", status: 401 });
            }

            const { data } = await axios.get(`${process.env.AUTH_MICROSERVICESS_URL}${process.env.AUTH_ADMIN_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${adminAccessToken}`
                },
                withCredentials: true
            })

            if (data.data._id !== tokenDecreapt.id) {
                return res.status(401).json({ message: "Unauthorize Access !!", status: 401 });
            }

            if (!data?.data?.superAdmin) {
                return res.status(400).json({ message: "Access Denied" });
            }

            req.adminData = data;
            next();
        } catch (err) {
            if (err.response) {
                return res.status(err.response.status).json({
                    message: err.response.data.message || "Auth failed",
                });
            }

            return res.status(500).json({ message: err });
        }
    }



}
export default AdminVerifation;