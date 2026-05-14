import { Teacher } from "../models/teacherModels.model.js";
import { Student } from "../models/studentModels.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const CreateTokenData = async (userId) => {
    const userData = await Teacher.findById(userId);
    const creatAccessToken = await userData.AccessTokenGenerater();
    const createRefreshToken = await userData.RefreshTokenGenerater();
    userData.refreshtkn = createRefreshToken
    userData.save({ validateBeforeSave: false })
    return { creatAccessToken, createRefreshToken }
}


class TeacherController {
    static async registration(req, res) {
        try {
            const { name, password, year, course, moNumber, gender } = req.body

            if (!name || !password || !year || !course || !moNumber || !gender) {
                return res.status(400).json({ message: "all column require !!", status: 400 })
            }
            const checkUser = await Teacher.findOne({ moNumber });

            if (checkUser) {
                return res.status(400).json({ message: "Try another Contact Number !!", status: 400 });
            }
            const userCreate = await Teacher.create({
                name, password, year, course, moNumber, gender
            })
            const userverify = await Teacher.findById(userCreate._id).select("-password  -role");

            if (!userverify) {
                return res.status(400).json({ message: "User Not Registered !!", status: 400 });
            }
            return res.status(200).json({ message: "Successfully User Registered !!", status: 200, data: userverify });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async loginss(req, res) {
        try {
            const { moNumber, password } = req.body;
            if (!moNumber || !password) {
                return res.status(400).json({
                    message: "all column required !!",
                    status: 400
                });
            }

            const formattedNumber = Number(moNumber.toString().trim());
            const userCheck = await Teacher.findOne({ moNumber: formattedNumber }).select(" -role");
            if (!userCheck) {
                return res.status(400).json({
                    message: "Faculty identifier not found !!",
                    status: 400
                });
            }

            const passwordVerification = await bcrypt.compare(password, userCheck.password);
            if (!passwordVerification) {
                return res.status(400).json({
                    message: "contact & Password Wrong !!",
                    status: 400
                });
            }
            const userData = await Teacher.findById(userCheck._id).select("-password -role");
            if (!userData) {
                return res.status(400).json({
                    message: "Credentail Error User Not Found !!",
                    status: 400
                })
            }

            const { creatAccessToken, createRefreshToken } = await CreateTokenData(userData._id);

            const Optionvalidation = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }
            return res.status(200)
                .cookie("teacherAccessToken", creatAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1 * 24 * 60 * 60 * 1000
                })
                .cookie("teacherRefreshToken", createRefreshToken, Optionvalidation)
                .json({ message: "Successfully Teacher Login !!", data: { userData, createRefreshToken, creatAccessToken }, success: true });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async loginProfiles(req, res) {
        try {
            const user = await req.user;

            if (!user) {
                return res.status(401).json({ message: "unAuthorize Access !!", status: 401 });
            }
            const userData = await Teacher.findById(user?.id).select("-password  -refreshtkn");

            if (userData?._id?.toString() != user?.id?.toString()) {
                return res.status(401).json({ message: "Credential Error !!", status: 401 });
            }
            return res.status(200).json({ message: "SuccessFully Teacher Fatched !!", userData, status: 200, userData });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async Logout(req, res) {
        try {
            const user = req.user;

            const userLogout = await Teacher.findByIdAndUpdate(user.id, { refreshtkn: "1" }, { new: true }).select("-password");

            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }

            return res.status(200).clearCookie("teacherAccessToken", option).clearCookie("teacherRefreshToken", option).json({ message: "Logout Successfully !!", status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async RefreshTokenApie(req, res) {
        try {

            const { teacherRefreshToken } = req.cookies;
            if (!teacherRefreshToken) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 })
            }
            const verifyToken = await jwt.verify(teacherRefreshToken, process.env.REFRESH_TOKEN_SECRET)

            const userFind = await Teacher.findById(verifyToken.id).select("-password  -role");
            if (!userFind) {
                return res.status(400).json({ message: "invalid refresh token !!", status: 400 })
            }

            if (!userFind || userFind.refreshtkn.toString() !== teacherRefreshToken.toString()) {
                return res.status(403).json({ message: "Access Denied !!", status: 403 });
            }
            const { creatAccessToken, createRefreshToken } = await CreateTokenData(userFind._id);

            if (!creatAccessToken && !createRefreshToken) {
                return res.status(403).json({ message: "Something Went Wrong !!", status: 403 });
            }

            const Optionvalidation = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }
            return res.status(200)
                .cookie("teacherAccessToken", creatAccessToken, Optionvalidation)
                .cookie("teacherRefreshToken", createRefreshToken, Optionvalidation)
                .json({ message: "Successfully User Login !!", data: { createRefreshToken, creatAccessToken } });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async StudentList(req, res) {
        try {
            const { course, semester, section, year } = req.query;
            const filter = {};
            
            // Broad search for debugging
            if (course) filter.course = { $regex: course.trim().split(" ")[0], $options: "i" };
            // Temporarily ignore semester, section, year for debugging
            
            const studentList = await Student.find(filter).select("-password -refreshtkn ").sort({ createdAt: -1 });

            return res.status(200).json({ 
                message: "Successfully Student Fetched !!", 
                status: 200, 
                studentList,
                debugFilter: filter 
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async verifyContact(req, res) {
        try {
            const { moNumber } = req.body;
            if (!moNumber) return res.status(400).json({ message: "Mobile number required" });

            const formattedNumber = Number(moNumber.toString().trim());
            const user = await Teacher.findOne({ moNumber: formattedNumber });
            
            if (!user) {
                return res.status(404).json({ message: "Faculty identifier not found. Contact Admin for deployment.", status: 404 });
            }

            return res.status(200).json({
                exists: true,
                hasPassword: !!user.password,
                name: user.name,
                status: 200
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async setupPassword(req, res) {
        try {
            const { moNumber, password } = req.body;
            if (!moNumber || !password) return res.status(400).json({ message: "Mobile and Password required" });

            const formattedNumber = Number(moNumber.toString().trim());
            const user = await Teacher.findOne({ moNumber: formattedNumber });
            
            if (!user) return res.status(404).json({ message: "Faculty node not found" });

            if (user.password) {
                return res.status(400).json({ message: "Access Key already mapped. Please login." });
            }

            user.password = password; // Model pre-save hook will hash this
            await user.save();

            return res.status(200).json({ message: "Protocol setup successful. You can now login.", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default TeacherController;