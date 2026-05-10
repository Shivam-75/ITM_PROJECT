import mongoose from "mongoose";
import { Marks } from "../../teacher/models/sesonalMark.models.js";
import { TimeTable } from "../../teacher/models/timeTableModel.models.js";
import { Attendance } from "../../teacher/models/attendanceModel.models.js";

class studentSesonalController {
    static async showResult(req, res) {
        try {
            const { course } = req.students;
            const { id } = req.params;

            const searchResult = await Marks.find({
                $and: [{
                    rollNo: id,
                    course: course
                }]
            });


            if (!searchResult || searchResult.length === 0) {
                return res.status(404).json({
                    message: "No result found",
                });
            }

            return res.status(200).json({
                message: "Result fetched successfully",
                result: searchResult,
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
            });
        }
    }

    //? time table 
    static async studentShowTb(req, res) {
        try {
            const { section } = req.params;
            const { course } = req.students;

            if (!course) {
                return res.status(400).json({ message: "Student Course not identified", status: 400 });
            }

            const findTimeTable = await TimeTable.findOne({
                section: section.toLowerCase(),
                course: course.toLowerCase()
            });

            if (!findTimeTable) {
                return res.status(404).json({
                    message: "TimeTable Not Found !!",
                    status: 404
                });
            }

            return res.status(200).json({
                message: "Successfully Found !!",
                status: 200,
                data: findTimeTable
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }

    //? Attendance
    static async showAttendance(req, res) {
        try {
            const { _id, course } = req.students;
            const { section, semester } = req.query;

            if (!_id || !course || !section || !semester) {
                return res.status(400).json({ message: "Missing required profile parameters (course/section/semester)", status: 400 });
            }

            const attendanceRecords = await Attendance.find({
                course: course.toLowerCase(),
                section: section.toLowerCase(),
                semester: Number(semester)
            }).sort({ date: -1 });

            const studentStats = attendanceRecords.map(record => {
                const myRecord = record.records.find(r => r.studentId === _id.toString());
                return {
                    date: record.date,
                    subject: record.subject,
                    status: myRecord ? myRecord.status : "N/A"
                };
            });

            return res.status(200).json({
                message: "Successfully Found Attendance !!",
                status: 200,
                data: studentStats
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }
}

export default studentSesonalController;
