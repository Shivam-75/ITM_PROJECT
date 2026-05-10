import { Attendance } from "../models/attendanceModel.models.js";

class TeacherAttendanceController {
    static async uploader(req, res) {
        const teacherId = req.user.id;

        try {
            const { date, subject, course, semester, section, batch, year, period, students } = req.body;

            if (!date || !subject || !course || !semester || !section || !batch || !year || !period || !students) {
                return res.status(400).json({ message: "Fill all columns properly", status: 400 });
            }

            // Upsert attendance for the given date, class, and period
            const existingRecord = await Attendance.findOne({
                date,
                subject,
                course,
                semester,
                section,
                period
            });

            if (existingRecord) {
                // Update existing
                existingRecord.students = students;
                existingRecord.teacherId = teacherId;
                existingRecord.batch = batch;
                existingRecord.year = year;
                await existingRecord.save();

                return res.status(200).json({
                    message: "Attendance Updated Successfully !!",
                    status: 200,
                    data: existingRecord
                });
            }

            // Create new
            const newAttendance = await Attendance.create({
                teacherId,
                date,
                subject,
                course,
                semester,
                section,
                batch,
                year,
                period,
                students
            });

            return res.status(201).json({
                message: "Attendance Uploaded Successfully !!",
                status: 201,
                data: newAttendance
            });

        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async viewAttendance(req, res) {
        try {
            const teacherId = req.user.id;
            const { section, semester } = req.query;

            let query = { teacherId };
            if (section) query.section = section;
            if (semester) query.semester = semester;

            const attendanceData = await Attendance.find(query).sort({ date: -1 });

            if (!attendanceData || attendanceData.length === 0) {
                return res.status(404).json({ message: "No Attendance Records Found", status: 404 });
            }

            return res.status(200).json({
                message: "Successfully Fetched Attendance",
                status: 200,
                data: attendanceData
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async adminViewAttendance(req, res) {
        try {
            const attendanceData = await Attendance.find().sort({ date: -1 });

            return res.status(200).json({
                message: "Successfully Fetched All Attendance Records",
                status: 200,
                data: attendanceData
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default TeacherAttendanceController;
