import { Link } from "../models/linksModel.js";

class linksController {
    static async uploader(req, res) {
        const user = await req.user;
        try {
            const { course, semester, section, linkas, topic, subject } = req.body

            if (!course || !semester || !section || !linkas || !topic || !subject) {
                return res.status(400).json({ message: "Fill all Column !!", status: 400 });
            }
            const uploadLinks = await Link.create({
                userId: user.id,
                course,
                semester,
                section,
                linkas,
                topic,
                subject
            })

            const searchUserData = await Link.findById(uploadLinks._id);

            if (!searchUserData) {
                return res.status(400).json({ message: "Links upload Failed !!", status: 400 });
            }

            return res.status(201).json({ message: "Link Successfully uploaded !!", status: 201, searchUserData });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    static async showLinks(req, res) {
        const user = await req.user;
        try {

            const findUserLinks = await Link.find({ userId: user.id }).sort({ createdAt: -1 });

            if (!findUserLinks) {
                return res.status(400).json({ message: "Links Not Found !!", status: 400 });
            }

            return res.status(200).json({ message: "Links Successfully Fatched !! ", status: 200, findUserLinks });

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
    static async LinkDelete(req, res) {
        const { id } = req.params
        try {

            const DataDelete = await Link.findByIdAndDelete(id);

            if (!DataDelete) {
                return res.status(400).json({ message: "Link Not Deleted ", status: 400 });
            }

            return res.status(200).json({ message: "Successfully Link Deleted !!", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    static async updateLink(req, res) {
        try {
            const { _id, linkas } = req.body;
            if (!_id || !linkas) {
                return res.status(400).json({ message: "Fill All Column", status: 400 });
            }

            const SearchUpdate = await Link.findByIdAndUpdate(_id, { linkas });

            if (!SearchUpdate) {
                return res.status(400).json({ message: "Link Not Updated !!", status: 400 });
            }
            return res.status(201).json({ message: "Successfully Updated Links !!", status: 201 });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default linksController;