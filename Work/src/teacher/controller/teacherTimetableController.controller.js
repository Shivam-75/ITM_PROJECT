import { TimeTable } from "../models/timeTableModel.models.js";

class teacherTimeTableController {
    static async uploader(req, res) {
        const userId = req.user.id;
        try {
            const { course, section, semester, timeSheet } = req.body;

            if (!course || !section || !semester || !timeSheet) {
                return res.status(400).json({
                    message: "Fill all Column",
                    status: 400
                });
            }

            // 🔍 Check if timetable already exists (Exact match, no toLowerCase)
            const existingTimeTable = await TimeTable.findOne({
                course,
                section,
                semester
            });

            // ✅ If exists → SYNC/UPDATE (replace existing lectures for the same day)
            if (existingTimeTable) {
                const incomingDay = timeSheet[0]?.day;

                // Remove existing lectures for THAT specific day
                const filteredTimeSheet = existingTimeTable.timeSheet.filter(item => item.day !== incomingDay);

                // Add new lectures
                const updatedTimeSheet = [...filteredTimeSheet, ...timeSheet];

                existingTimeTable.timeSheet = updatedTimeSheet;
                await existingTimeTable.save();

                return res.status(200).json({
                    message: `${incomingDay} Timetable updated successfully`,
                    status: 200,
                    data: existingTimeTable
                });
            }

            // ✅ If not exists → CREATE new
            const newTimeTable = await TimeTable.create({
                userId,
                course,
                section,
                semester,
                timeSheet
            });

            return res.status(201).json({
                message: "Timetable created successfully",
                status: 201,
                data: newTimeTable
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }

    static async deleteTeacherTimeTable(req, res) {
        const { id } = req.params;
        try {
            const TimeTableDelete = await TimeTable.findByIdAndDelete(id);

            if (!TimeTableDelete) {
                return res.status(400).json({ message: "Delete Failed ", status: 400 });
            }

            return res.status(200).json({ message: "Successfully TimeTable Deleted !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async showTeacherTimeTable(req, res) {
        try {
            const userId = req.user.id;
            const TimeTableFind = await TimeTable.find({ userId }).sort({ createdAt: -1 });

            if (!TimeTableFind || TimeTableFind.length === 0) {
                return res.status(200).json({ message: "No Time Table found", status: 200, data: [] });
            }

            return res.status(200).json({ message: "Successfully Timetable Fetched !!", status: 200, data: TimeTableFind });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default teacherTimeTableController;
