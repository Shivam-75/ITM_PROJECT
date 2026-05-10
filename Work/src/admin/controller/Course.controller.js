import { Course } from "../models/course.model.js";

class CourseController {
    static async createCourse(req, res) {
        try {
            const { name, department, deptCode, hod, duration, description, status } = req.body;

            if (!name || !department || !deptCode || !duration) {
                return res.status(400).json({ message: "Name, department, deptCode, and duration are required", status: 400 });
            }

            const existingCourse = await Course.findOne({ name });
            if (existingCourse) {
                return res.status(400).json({ message: "Course with this name already exists", status: 400 });
            }

            const course = await Course.create({
                name,
                department,
                deptCode,
                hod,
                duration,
                description,
                status: status || "Active"
            });

            return res.status(201).json({
                message: "Course created successfully",
                status: 201,
                data: course
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async getAllCourses(req, res) {
        try {
            const courses = await Course.find().sort({ createdAt: -1 });
            return res.status(200).json({
                message: "Courses fetched successfully",
                status: 200,
                data: courses
            });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }

    static async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Course.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ message: "Course not found", status: 404 });
            }
            return res.status(200).json({ message: "Course deleted successfully", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: err.message, status: 500 });
        }
    }
}

export default CourseController;
