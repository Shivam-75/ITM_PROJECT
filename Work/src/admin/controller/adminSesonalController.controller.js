import { Marks } from "../../teacher/models/sesonalMark.models.js";
import { TimeTable } from "../../teacher/models/timeTableModel.models.js";

class adminSesonalMarkController {
    static async showDepartmentResult(req, res) {
        const { department } = req.params;
        try {
            const departmentResult = await Marks.find({ course: department });

            if (!departmentResult) {
                return res.status(400).json({ message: `Result Not Found ${department} !!`, status: 400 });
            }

            return res.status(200).json({ message: `Successfully Data Show ${department} !!`, status: 200, data: departmentResult });
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    //? department wise data timetable

    static async showDepartmentTimeTable(req, res) {
        try {
            const { department } = req.params;

            const departmentTimetable = await TimeTable.find({ course: department });

            if (!departmentTimetable) {
                return res.status(400).json({ message: "TimeTable Not Found !!", status: 400 });
            }

            return res.status(200).json({ message: `succeessfully data Show ${department} !!`, status: 200, data: departmentTimetable });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }


    static async deleteDepartmentTimeTable(req, res) {
        try {
            const { id } = req.params;

            const departmentTimetable = await TimeTable.findByIdAndDelete({ _id: id });

            if (!departmentTimetable) {
                return res.status(400).json({ message: "TimeTable Not Found !!", status: 400 });
            }

            return res.status(200).json({ message: `succeessfully Deleted ${id} !!`, status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async bulkMarksView(req, res) {
        try {
            const { course, semester, section, year } = req.query;
            const filter = {};
            if (course) filter.course = course;
            if (semester) filter.semester = semester;
            if (section) filter.section = section;
            if (year) filter.year = year;

            const marksData = await Marks.find(filter).sort({ createdAt: -1 });

            return res.status(200).json({ 
                message: marksData.length > 0 ? "Successfully Fetched Bulk Marks !!" : "No Marks Found for these filters.", 
                status: 200, 
                data: marksData 
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async deleteMark(req, res) {
        try {
            const { id } = req.params;
            const deletedMark = await Marks.findByIdAndDelete(id);

            if (!deletedMark) {
                return res.status(404).json({ message: "Mark Record Not Found !!", status: 404 });
            }

            return res.status(200).json({ message: "Mark Record Deleted Successfully !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}
export default adminSesonalMarkController;
