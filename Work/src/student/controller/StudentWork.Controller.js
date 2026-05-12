import { Assignment } from "../../teacher/models/AssignmentModel.js";
import { Homework } from "../../teacher/models/homeworkModel.js";
import { Link } from "../../teacher/models/linksModel.js";
import { Notice } from "../../teacher/models/noticeModels.js";
import { TimeTable } from "../../teacher/models/timeTableModel.models.js";
import { ModelPaper } from "../../teacher/models/modelPaper.model.js";
import { Syllabus } from "../../teacher/models/syllabusModel.js";

class StudentwrokController {
    static async ShowDepartmentHw(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 })
            const hwData = await Homework.find({ 
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            });
            return res.status(200).json({ message: "Successfully Fatched HomeWrok !!", status: 200, data: hwData });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }

    static async ShoDepartmentAss(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 })
            const ASsData = await Assignment.find({ 
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            });
            return res.status(200).json({ message: "Successfully Fatched Assignment !!", status: 200, data: ASsData });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }

    static async showDepartmentNotice(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 })
            const NoticeData = await Notice.find({ 
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            });
            return res.status(200).json({ message: "Successfully Fatched Notice !!", status: 200, data: NoticeData });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }

    static async showDepartmentLink(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 })
            const LinkData = await Link.find({ 
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            });
            return res.status(200).json({ message: "Successfully Fatched Link !!", status: 200, data: LinkData });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }

    static async showTimetable(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 });
            
            const timetable = await TimeTable.findOne({
                course: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            });
            
            return res.status(200).json({ success: true, message: "Timetable Synced", data: timetable });
        } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
    }

    static async showDepartmentModelPapers(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 });
            
            const papers = await ModelPaper.find({
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase(),
                section: user.section.toLowerCase()
            }).sort({ createdAt: -1 });

            return res.status(200).json({ 
                success: true, 
                message: "Successfully Fetched Model Papers !!", 
                status: 200, 
                data: papers 
            });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }

    static async showDepartmentSyllabus(req, res) {
        try {
            const user = req.students;
            if (!user) return res.status(401).json({ message: "Access Denied !!", status: 401 });
            
            const syllabusData = await Syllabus.find({
                department: user.course.toLowerCase(),
                semester: user.semester.toString().toLowerCase()
            }).sort({ createdAt: -1 });

            return res.status(200).json({ 
                message: "Successfully Fetched Syllabus !!", 
                status: 200, 
                data: syllabusData 
            });
        } catch (err) { return res.status(500).json({ message: err.message }); }
    }
}

export default StudentwrokController;