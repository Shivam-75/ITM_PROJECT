import { Marks } from "../models/sesonalMark.models.js";

class teacherSesonalController {
    static async uploader(req, res) {
        const { id } = req.user;
        try {

            const { name, rollNo, course, section, semester, subjects } = req.body;

            if (!name || !rollNo || !course || !section || !semester || !subjects || subjects.length === 0) {
                return res.status(400).json({ message: "Fill All Column !!", status: 400 });
            }

            const marCreate = await Marks.create({
                userId: id,
                name,
                rollNo,
                course,
                section,
                semester,
                subjects
            });

            if (!marCreate) {
                return res.status(400).json({ message: "Someting Went Wrong !!", status: 400 });
            }

            return res.status(201).json({ message: "Successfully Mark Uploaded !!", status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    static async markData(req, res) {
        try {

            const { id } = req.user;

            const uploadedData = await Marks.find({ userId: id });

            if (!uploadedData) {
                return res.status(400).json({ message: "Mark Not uploaded !!", status: 400 });
            }

            return res.status(200).json({ message: "Succeefully fatched Mark !!", status: 200, data: uploadedData });

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    static async markDelete(req, res) {
        const { id } = req.params;
        try {

            const markDelete = await Marks.findByIdAndDelete(id);

            if (!markDelete) {
                return res.status(401).json({ message: "Mark Not Found !!", status: 401 });
            }

            return res.status(200).json({ message: "Mark Deleted Successfully !!", status: 200, markDelete });

        } catch (err) {
            return res.json({ message: err });
        }
    }
}

export default teacherSesonalController;
