import { Exam } from "../models/examSchedule.model.js";

class ExamScheduleController {
    static async uploader(req, res) {
        try {
            const { Department, Semester, ct, Subject, ExamType, Date, time, RoomNo } = req.body;

            // ✅ FIXED validation
            if (!ct || !Department || !Semester || !Subject || !ExamType || !Date || !time || !RoomNo) {
                return res.status(400).json({
                    message: "Fill All columns !!",
                    status: 400
                });
            }

            const createExam = await Exam.create({
                userId: req.user?.id,
                Department, Semester, ct, Subject, ExamType, Date, time, RoomNo
            });

            return res.status(201).json({
                message: `Successfully ${Department} Schedule Created !!`,
                status: 201,
                data: createExam
            });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }

    static async deleteExamScedule(req, res) {
        try {
            const { id } = req.params;

            const DeleteShedule = await Exam.findByIdAndDelete(id);

            if (!DeleteShedule) {
                return res.status(400).json({ message: "Not Deleted " });
            }

            return res.status(200).json({ message: "Successfully Deleted !!", status: 200 });

        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }

    static async getExams(req, res) {
        try {
            const data = await Exam.find();
            return res.status(200).json({
                message: "Exams Fetched Successfully",
                status: 200,
                data
            });
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                status: 500
            });
        }
    }
}

export default ExamScheduleController;
