import { Homework } from "../models/homeworkModel.js";

class homeWrokController {
    static async Homewokuploader(req, res) {
        const user = await req.user;

        try {
            const { subject, semester, section, year, department, questions, submissionDate } = req.body;

            if (!subject || !semester || !section || !year || !department || !questions) {
                return res.status(401).json({ message: "Fill all Column !!", status: 401 });
            }

            const createUser = await Homework.create({
                userId: user?.id,
                subject,
                semester,
                section,
                year,
                department,
                questions,
                submissionDate
            })

            const homworkFind = await Homework.findById(createUser?._id);

            if (!homworkFind) {
                return res.status(401).json({
                    message: "Homework uploade  Failed !!",
                    status: 401
                })
            }

            return res.status(200).json({
                message: "Homework Successfully uploaded !!",
                status: 200,
                homworkFind
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async HomeWorkShow(req, res) {
        try {
            const user = await req.user;
            if (!user) {
                return res.status(400).json({
                    message: "unAuthorize Access !!",
                    status: 400
                })
            }

            const HomeworkData = await Homework.find({ userId: user.id })
                .sort({ createdAt: -1 });

            if (!HomeworkData) {
                return res.status(400).json({ message: "Homework Not Found !!", status: 400 })
            }
            return res.status(200).json({ message: "Successfully Homework Fatched !!", HomeworkData, status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async HomeworkDelete(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ message: "Choose Homework !!", status: 400 });
            }

            const findHomework = await Homework.findByIdAndDelete(id);

            if (!findHomework) {
                return res.status(400).json({ message: "Homework Not found !! ", status: 400 })
            }

            return res.status(200).json({ message: "Homework Deleted Sucessfully  !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async UpdateHomework(req, res) {
        try {
            const { id, data } = req.body;

            if (!id || !data) {
                return res.status(400).json({ message: "Fill All Column " });
            }

            const userSearch = await Homework.findByIdAndUpdate(id, { questions: data }, { new: true });

            if (!userSearch) {
                return res.status(400).json({ message: "Uploade Faild !!", status: 400 });
            }

            return res.status(201).json({ message: "Successfully Homework uploaded!!", status: 201 });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }


}

export default homeWrokController;