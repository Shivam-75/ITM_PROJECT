import { Assignment } from "../../teacher/models/AssignmentModel.js";
import { Homework } from "../../teacher/models/homeworkModel.js";
import { Notice } from "../../teacher/models/noticeModels.js";
import { Link } from "../../teacher/models/linksModel.js"

//todo all hw fatched 

class AdminWorkController {
    static async homWorkRecords(req, res) {
        try {
            const HomeWrokDatass = await Homework.find().sort({ createdAt: -1 });

            if (!HomeWrokDatass || HomeWrokDatass.lenght === 0) {
                return res.status(400).json({ message: "Homework Not Found !!", status: 400 });
            }
            return res.status(200).json({ message: "Successfully Data Fatched !!", status: 200, HomeWrokDatass });

        } catch (err) {
            return res.status(500).json({ message: err });
        }
    }

    //? all assignmnet fatched;

    static async AssWorkRecords(req, res) {
        try {

            const AssignmentData = await Assignment.find().sort({ createdAt: -1 });

            if (!AssignmentData || AssignmentData.length === 0) {
                return res.status(400).json({ message: "Successfully Data Fatched !!", status: 200 });
            }
            return res.status(200).json({ message: "Successfully Data Fatched !!", status: 200, AssignmentData });


        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async NoticeRecord(req, res) {
        try {

            const NoticeData = await Notice.find().sort({ createdAt: -1 });

            if (!NoticeData || NoticeData.length === 0) {
                return res.status(400).json({ message: "Successfully Data Fatched !!", status: 200 });
            }
            return res.status(200).json({ message: "Successfully Data Fatched !!", status: 200, NoticeData });


        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async LinkRecorder(req, res) {
        try {

            const LinkDatass = await Link.find().sort({ createdAt: -1 });

            if (!LinkDatass || LinkDatass.length === 0) {
                return res.status(400).json({ message: "Successfully Data Fatched !!", status: 200 });
            }
            return res.status(200).json({ message: "Successfully Data Fatched !!", status: 200, LinkDatass });


        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default AdminWorkController;