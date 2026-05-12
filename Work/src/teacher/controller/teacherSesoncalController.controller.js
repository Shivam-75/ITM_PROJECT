import { Marks } from "../models/sesonalMark.models.js";

class teacherSesonalController {
    static async uploader(req, res) {
        const teacherId = req.user.id;
        try {
            const { userId, course, year, semester, section, entries } = req.body;

            if (!userId || !course || !year || !semester || !section || !entries || entries.length === 0) {
                return res.status(400).json({ message: "Fill All Columns Properly !!", status: 400 });
            }

            const marCreate = await Marks.findOneAndUpdate(
                { userId, course, year, semester, section },
                { entries, teacherId },
                { new: true, upsert: true }
            );

            if (!marCreate) {
                return res.status(400).json({ message: "Something Went Wrong !!", status: 400 });
            }

            return res.status(201).json({ message: "Successfully Marks Synchronized !!", status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async markData(req, res) {
        try {
            const teacherId = req.user.id;
            const { course, semester, section, year, userId } = req.query;
            
            const filter = {};
            if (course) filter.course = course;
            if (semester) filter.semester = semester;
            if (section) filter.section = section;
            if (year) filter.year = year;
            if (userId) filter.userId = userId;

            const uploadedData = await Marks.find(filter).sort({ createdAt: -1 });

            if (!uploadedData || uploadedData.length === 0) {
                return res.status(404).json({ message: "No Marks Found for these filters !!", status: 404 });
            }

            return res.status(200).json({ message: "Successfully Fetched Marks !!", status: 200, data: uploadedData });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async markDelete(req, res) {
        const { id } = req.params;
        try {
            const deletedMark = await Marks.findByIdAndDelete(id);

            if (!deletedMark) {
                return res.status(404).json({ message: "Marks Record Not Found !!", status: 404 });
            }

            return res.status(200).json({ message: "Marks Record Deleted Successfully !!", status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default teacherSesonalController;
