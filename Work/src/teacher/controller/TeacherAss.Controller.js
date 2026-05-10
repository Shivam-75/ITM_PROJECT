import { Assignment } from "../models/AssignmentModel.js";

class AssignmnetFacality {
    static async uploader(req, res) {
        const user = await req.user;
        try {
            const { subject, semester, section, year, department, questions, submissionDate } = req.body;
            if (!subject || !semester || !section || !year || !department || !questions) {
                return res.status(400).json({ mesasge: "Fill all column !!", status: 401 });
            }

            const AssignmnetCreate = await Assignment.create({
                userId: user?.id,
                subject, semester, section, year, department, questions, submissionDate
            })
            const checkUploader = await Assignment.findOne(AssignmnetCreate._id);
            if (!checkUploader) {
                return res.status(400).json({ message: "Uploading Faild !!", status: 400 });
            }

            return res.status(200).json({
                message: "Successfully uploaded !!",
                checkUploader,
                status: 200
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    //todo get teacher assignmnet ------

    static async AssignmnetShow(req, res) {
        try {
            const user = await req.user;
            if (!user) {
                return res.status(400).json({
                    message: "unAuthorize Access !!",
                    status: 400
                })
            }

            const AssignmnetData = await Assignment.find({ userId: user.id }).sort({ createdAt: -1 });
            if (!AssignmnetData) {
                return res.status(400).json({ message: "Homework Not Found !!", status: 400, })
            }
            return res.status(200).json({ message: "Successfully Fatched Fatched !!", AssignmnetData, status: 200 });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    //? get all assignmnent = howmework

    static async AssignmentDelete(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ message: "Choose Assignment !!", status: 400 });
            }

            const findAssignment = await Assignment.findByIdAndDelete(id);

            if (!findAssignment) {
                return res.status(400).json({ message: "Assignmnet Not found !! ", status: 400 })
            }

            return res.status(200).json({ message: "Assignmnet Sucessfully Deleted !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async AssignmentUpdate(req, res) {
        try {

            const { id, data } = req.body;

            if (!id || !data) {
                return res.status(400).json({ message: "Fill All Column !!", status: 400 });
            }

            const AssignmentUpdated = await Assignment.findByIdAndUpdate(id, { questions: data });

            if (!AssignmentUpdated) {
                return res.status(400).json({ message: "Uploade Faild !!", status: 400 });
            }

            return res.status(201).json({ message: "Successfully Updated !!", status: 200 });


        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

export default AssignmnetFacality;