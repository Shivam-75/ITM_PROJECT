import { StudentProfile } from "../models/studentProfile.models.js";

class StudentProfileController {
    static async createProfile(req, res) {
        try {
            const {
                name, course, year, moNumber, collegeName, stream,
                passingYear, caste, gender, board, parentName,
                parentMobile, motherName, address, studentId, semester
            } = req.body;

            if (!name || !moNumber || !studentId || !semester) {
                return res.status(400).json({ message: "Essential fields (Name, Mobile, ID, Semester) missing for profile creation", status: 400 });
            }

            const existingProfile = await StudentProfile.findOne({ studentId });
            if (existingProfile) {
                return res.status(401).json({ message: "Profile already exists with this ID", status: 401 });
            }

            const profile = await StudentProfile.create({
                collegeName, name, course, year, moNumber, stream,
                passingYear, caste, gender, board, parentName,
                parentMobile, motherName, address, studentId, semester
            });

            return res.status(201).json({
                message: "Student Profile Synchronized with Report System",
                status: 201,
                data: profile
            });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async getStudentList(req, res) {
        try {
            const studentList = await StudentProfile.find().sort({ createdAt: -1 });
            return res.status(200).json({
                message: "Profiles Fetched Successfully",
                status: 200,
                studentList
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async deleteProfile(req, res) {
        try {
            const { id } = req.params;
            const deleted = await StudentProfile.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(400).json({ message: "Profile not found", status: 400 });
            }
            return res.status(200).json({ message: "Profile Removed from Report Service", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default StudentProfileController;
