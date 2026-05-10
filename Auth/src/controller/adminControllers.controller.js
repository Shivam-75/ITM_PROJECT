import { Admin } from "../models/adminModels.model.js";
import { Student } from "../models/studentModels.model.js";
import { Teacher } from "../models/teacherModels.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const AdminTokenCreator = async (userId) => {
    const user = await Admin.findById(userId).select("-password");
    const adminCreateAccessToken = await user.adminAccessToken();
    const adminCreateRefreshToken = await user.adminRefreshToken();
    user.refreshtkn = await adminCreateRefreshToken;
    user.save({ validateBeforeSave: false });
    return { adminCreateAccessToken, adminCreateRefreshToken };

}
class AdminController {
    static async AdminRegistration(req, res) {
        try {
            const { name, password, mobNumber } = req.body;

            if (!name || !password || !mobNumber) {
                return res.status(400).json({ message: "Fill All column !!", status: 400 });
            }

            const findUser = await Admin.findOne({ mobNumber });
            if (findUser) {
                return res.status(400).json({ message: "Try Another Mobile Number !!", status: 400 });
            }

            const createUser = await Admin.create({
                name, password, mobNumber
            })

            const searchUser = await Admin.findById(createUser._id).select("-password ");

            if (!searchUser) {
                return res.status(400).json({ message: "Registraiton Faild !!", status: 400 });
            }

            return res.status(201).json({ message: "Successfully Admin Registered !!", status: 201, searchUser });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }


    static async adminLogin(req, res) {
        try {
            const { mobNumber, password } = req.body;

            if (!mobNumber || !password) {
                return res.status(400).json({
                    message: "fill All column !!",
                    status: 400
                });
            }

            const userCheck = await Admin.findOne({ mobNumber });
            if (!userCheck) {
                return res.status(400).json({
                    message: "User Not Exist !!",
                    status: 400
                });
            }

            const passworVerification = await bcrypt.compare(password, userCheck.password);

            if (!passworVerification) {
                return res.status(400).json({ message: "Contact  & Password Wrong !!", status: 400 });
            }

            const refeachUser = await Admin.findById(userCheck._id).select("-password -superAdmin ");

            if (!refeachUser) {
                return res.status(400).json({ message: "user Not Found !!", status: 400 });
            }

            const { adminCreateAccessToken, adminCreateRefreshToken } = await AdminTokenCreator(refeachUser._id);

            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 5 * 24 * 60 * 60 * 1000
            }

            return res.status(200).cookie("adminAccessToken", adminCreateAccessToken, option).cookie("adminRefreshToken", adminCreateRefreshToken, option).json({ message: "Successfully Admin Login !!", status: 200, data: { refeachUser, adminCreateAccessToken, adminCreateRefreshToken } });

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    //? teacher ka data yha fatched hoga

    static async adminProfile(req, res) {
        try {
            const user = req.adminData

            const searchUser = await Admin.findById(user._id).select("-password  -refreshtkn");

            if (!searchUser) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 });
            }

            return res.status(200).json({ message: "SuccessFully Fatched !!", status: 200, data: searchUser });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    //? logout end point

    static async adminLogout(req, res) {
        try {

            const user = req.adminData

            const Logutur = await Admin.findByIdAndUpdate(user._id, { refreshtkn: "1" }).select("-password -superAdmin");

            if (!Logutur) {
                return res.status(400).json({ message: "user Not Logout !!", status: 400 });
            }
            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }
            return res.status(200).clearCookie("adminAccessToken", option).clearCookie("adminRefreshToken", option).json({ message: "Logout Successfully !!", staus: 200 });

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async adminRefreshToken(req, res) {
        try {
            const { adminRefreshToken } = req.cookies;

            if (!adminRefreshToken) {
                return res.status(400).json({ message: "Unauthorized Access !!", status: 400 });
            }

            const tokenVerification = await jwt.verify(adminRefreshToken, process.env.ADMIN_REFRESH_TOKEN_SECREAT);

            if (!tokenVerification) {
                return res.status(400).json({ message: "Access denied !!", status: 401 });
            }

            const findUser = await Admin.findById(tokenVerification.id).select("-password");

            if (!findUser || findUser.refreshtkn.toString() !== adminRefreshToken.toString()) {
                return res.status(401).json({ message: "Access Denied Token Expired !!", status: 401 });
            }

            const { adminCreateAccessToken, adminCreateRefreshToken } = await AdminTokenCreator(findUser._id);

            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 5 * 24 * 60 * 60 * 1000
            }

            return res.status(200).cookie("adminAccessToken", adminCreateAccessToken, option).cookie("adminRefreshToken", adminCreateRefreshToken, option).json({ message: "Successfully  Token Created  !!", status: 200 })

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async StudentList(req, res) {
        try {

            const studentList = await Student.find().select("-password -refreshtkn").sort({ createdAt: -1 });

            if (!studentList) {
                return res.status(400).json({ message: "Student Not Found !!", status: 400 });
            }

            return res.status(200).json({ message: "Successfully Student Fatched !!", status: 200, studentList });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async TeacherList(req, res) {
        try {

            const TeacherList = await Teacher.find().select("-password -refreshtkn").sort({ createdAt: -1 });

            if (!TeacherList) {
                return res.status(400).json({ message: "Student Not Found !!", status: 400 });
            }

            return res.status(200).json({ message: "Successfully Teacher Fatched !!", status: 200, TeacherList });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async TeacherDelete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Select Item !!", status: 400 });
            }

            const SearchDel = await Teacher.findByIdAndDelete(id);

            if (!SearchDel) {
                return res.status(400).json({ message: "Faild To Delete !!", status: 400 });
            }

            return res.status(200).json({ message: "Successfully Teacher Deleted !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    static async StudentDelete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Select Item !!", status: 400 });
            }

            const SearchDel = await Student.findByIdAndDelete(id);

            if (!SearchDel) {
                return res.status(400).json({ message: "Faild To Delete !!", status: 400 });
            }

            return res.status(200).json({ message: "Successfully Student Deleted !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}
export default AdminController;