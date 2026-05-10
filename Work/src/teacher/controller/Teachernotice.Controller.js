import { Notice } from "../models/noticeModels.js";

class NoticeController {
    static async uploader(req, res) {
        const user = await req.user;
        try {
            const { description, department, year, title, semester, section } = req.body;


            if ( !description || !department || !year || !title || !semester || !section) {
                return res.status(400).json({ message: "Fill all Column !!", status: 400 })
            }

            const NoticeCreate = await Notice.create({
                userId: user.id,
                description,
                department,
                year,
                title,
                semester,
                section
            })
            const serchNotice = await Notice.findById(NoticeCreate._id);

            if (!serchNotice) {
                return res.status(400).json({ message: "Notice Uploade Faild Try again !!", status: 400 });
            }
            return res.status(201).json({ message: "Successfully uploade Notice !!", status: 201, serchNotice });

        } catch (err) {
            return res.status(500).json({ err })
        }
    }
    static async showNotice(req, res) {
        const user = await req.user;
        try {

            const findNotice = await Notice.find({ userId: user.id }).sort({ createdAt: -1 })
            if (!findNotice) {
                return res.status(400).json({ message: "Notice not Found !!", status: 400 });
            }

            return res.status(200).json({ message: "Notice Successfully Fetched !!", status: 200, findNotice });

        } catch (err) {
            return res.status(500).json({ err });
        }
    }
    static async deleteNotice(req, res) {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ message: "Id not Found ", status: 400 });
            }

            const deleteNotice = await Notice.findByIdAndDelete(id);

            if (!deleteNotice) {
                return res.status(400).json({
                    message: "Notice not Deleted !!",
                    status: 400
                })

            }

            return res.status(200).json({ message: "Notice Deleted Successfully ", status: 200 });
        } catch (err) {
            return res.status(500).json({ err });
        }
    }


}
export default NoticeController