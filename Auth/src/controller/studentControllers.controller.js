import bcrypt from "bcryptjs";
import { Student } from "../models/studentModels.model.js";
import jwt from "jsonwebtoken";



const StudentTokenData = async (userId) => {
    const userData = await Student.findById(userId);
    const creatAccessToken = await userData.StudentAccessTokenGenerater();
    const createRefreshToken = await userData.StudentRefreshTokenGenerater();
    userData.refreshtkn = createRefreshToken
    userData.save({ validateBeforeSave: false })
    return { creatAccessToken, createRefreshToken }
}

class StudentController {
    static async GetNextId(req, res) {
        try {
            const { course, year } = req.query;
            if (!course || !year) {
                return res.status(400).json({ message: "Course and Year required" });
            }

            const yearSuffix = year.toString().split('-')[0].slice(-2) || "26";
            const courseCode = course.split(" ")[0].toUpperCase();
            
            const count = await Student.countDocuments({ 
                course: course.toUpperCase(), 
                year: year.toUpperCase() 
            });
            const serial = (count + 1).toString().padStart(2, '0');
            
            const nextId = `ITM/${yearSuffix}/${courseCode}/${serial}`;
            return res.status(200).json({ nextId });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async Registration(req, res) {
        try {
            const {
                name, course, year, moNumber, stream,
                passingYear, caste, gender, board, parentName,
                parentMobile, motherName, address, id, semester, section,
                batch, image, academicFee, isHostel, hostelFee, totalFee
            } = req.body;

            if (!name || !course || !year || !moNumber || !semester || !section) {
                return res.status(400).json({ message: "Name, Course, Year, Semester, Section and Mobile are required !!", status: 400 });
            }

            const searchUser = await Student.findOne({ moNumber });
            if (searchUser) {
                return res.status(401).json({ message: "Student with this Mobile already exists !!", status: 401 });
            }

            // Passwords are left blank/handled by the model default if not provided
            const password = req.body.password || "";

            // 🔹 Automatic ID Generation: ITM/YEAR/COURSE/SERIAL
            let finalStudentId = id;
            if (!finalStudentId) {
                const yearSuffix = year.toString().split('-')[0].slice(-2) || "26";
                const courseCode = course.split(" ")[0].toUpperCase();
                
                // Count existing students in this course & year to determine serial
                const count = await Student.countDocuments({ 
                    course: course.toUpperCase(), 
                    year: year.toUpperCase() 
                });
                const serial = (count + 1).toString().padStart(2, '0');
                
                finalStudentId = `ITM/${yearSuffix}/${courseCode}/${serial}`;
            }

            const studentCreate = await Student.create({
                name: name.toUpperCase(),
                course: course.toUpperCase(),
                year,
                moNumber,
                stream: stream?.toUpperCase(),
                passingYear,
                caste,
                gender,
                board: board?.toUpperCase(),
                parentName,
                parentMobile,
                motherName,
                address,
                studentId: finalStudentId,
                password,
                semester: semester.toUpperCase(),
                section: section.toUpperCase(),
                batch,
                image,
                academicFee,
                isHostel,
                hostelFee,
                totalFee
            });

            const findUser = await Student.findById(studentCreate._id).select("-password -isBlock -refreshtkn");

            if (!findUser) {
                return res.status(401).json({ message: "User Not Registered !!", status: 401 });
            }

            return res.status(201).json({ message: "Student Enrolled Successfully", status: 201, data: findUser });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async Login(req, res) {
        try {
            const { moNumber, password } = req.body;

            if (!moNumber || !password) {
                return res.status(401).json({ message: "Fill All column !!", status: 401 });
            }
            const SearchUser = await Student.findOne({ moNumber });

            if (!SearchUser) {
                return res.status(400).json({ message: "User Not Exist !!", status: 400 });
            }

            const verifyUserPassword = await bcrypt.compare(password, SearchUser.password);

            if (!verifyUserPassword) {
                return res.status(400).json({ message: "contact Number & Password Wrong !!", status: 400 });
            }
            const userData = await Student.findById(SearchUser._id).select("-password ");

            if (!userData) {
                return res.status(400).json({
                    message: "Credentail Error User Not Found !!",
                    status: 400
                })
            }

            const { creatAccessToken, createRefreshToken } = await StudentTokenData(userData._id)

            const Optionvalidation = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 3 * 24 * 60 * 60 * 1000,
            }

            return res.status(200)
                .cookie("studentAccessToken", creatAccessToken, Optionvalidation)
                .cookie("studentRefreshToken", createRefreshToken, Optionvalidation)
                .json({ message: "Successfully User Login !!", data: { userData, creatAccessToken, createRefreshToken }, success: true, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async StudentProgileShow(req, res) {
        try {
            const decodedUser = req.students;

            if (!decodedUser) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 });
            }

            const user = await Student.findById(decodedUser.id || decodedUser._id).select("-password -refreshtkn");

            if (!user) {
                return res.status(404).json({ message: "Student Not Found", status: 404 });
            }

            return res.json({
                message: "Successfully user Fetched !! ",
                status: 200,
                StudentData: user
            });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async StudentLogut(req, res) {
        try {
            const user = req.students?.id;

            if (!user) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 });
            }
            const searchUser = await Student.findByIdAndUpdate(user, { refreshtkn: "1" }, { new: true }).select("-password");

            const option = {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }

            if (!searchUser) {
                return res.status(400).json({ message: "Something Error !!", status: 400 });
            }

            return res.status(200).clearCookie("studentAccessToken", option).clearCookie("studentRefreshToken", option).json({ message: "Logout Successfully !!", staus: 200 });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    static async studentRefreshToken(req, res) {
        try {
            const { studentRefreshToken } = req.cookies;
            const user = req.students?._id;

            if (!studentRefreshToken) {
                return res.status(400).json({ message: "unAuthorize Access !!", status: 400 });
            }

            const Decode = await jwt.verify(studentRefreshToken, process.env.STUDENT_REFRESH_TOKEN);

            const userVerification = await Student.findById(Decode.id).select("-password -isBlock");

            if (!userVerification || userVerification.refreshtkn.toString() !== studentRefreshToken.toString()) {
                return res.status(400).json({ message: "unAuthoirze Access !!", status: 400 });
            }

            const { creatAccessToken, createRefreshToken } = await StudentTokenData(userVerification?._id)

            const Optionvalidation = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 30 * 24 * 60 * 60 * 1000
            }

            return res.status(201).cookie("studentAccessToken", creatAccessToken, Optionvalidation)
                .cookie("studentRefreshToken", createRefreshToken, Optionvalidation)
                .json({ message: "Successfully  Token Created !!", data: { creatAccessToken, createRefreshToken }, success: true, status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }
}

export default StudentController;