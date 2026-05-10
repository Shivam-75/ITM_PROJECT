import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coursesFilePath = path.join(__dirname, "../../database/courses.json");

class FileCourseController {
    // 📖 Get all courses from JSON file
    static async getCourses(req, res) {
        try {
            const data = await fs.readFile(coursesFilePath, "utf8");
            const courses = JSON.parse(data || "[]");
            return res.status(200).json({ courses, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: "Failed to read course registry", error: err.message, status: 500 });
        }
    }

    // ➕ Add a course to JSON file
    static async addCourse(req, res) {
        try {
            const { name, department, deptCode, hod, duration, description } = req.body;
            
            if (!name) {
                return res.status(400).json({ message: "Course name is required", status: 400 });
            }

            // Read existing data
            const data = await fs.readFile(coursesFilePath, "utf8");
            const courses = JSON.parse(data || "[]");

            // Create new course object
            const newCourse = {
                id: Date.now(), // Simple unique ID
                name: name.toLowerCase(),
                department: department?.toLowerCase() || "general",
                deptCode: deptCode || "",
                hod: hod || "",
                duration: duration || "N/A",
                description: description || "",
                createdAt: new Date().toISOString()
            };

            // Push and Save
            courses.push(newCourse);
            await fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), "utf8");

            return res.status(201).json({ 
                message: "Course successfully committed to registry file", 
                data: newCourse, 
                status: 201 
            });
        } catch (err) {
            return res.status(500).json({ message: "Failed to write to course registry", error: err.message, status: 500 });
        }
    }

    // ❌ Delete a course from JSON file
    static async deleteCourse(req, res) {
        try {
            const { id } = req.params;
            const data = await fs.readFile(coursesFilePath, "utf8");
            let courses = JSON.parse(data || "[]");

            const initialLength = courses.length;
            courses = courses.filter(c => c.id !== parseInt(id));

            if (courses.length === initialLength) {
                return res.status(404).json({ message: "Course ID not found", status: 404 });
            }

            await fs.writeFile(coursesFilePath, JSON.stringify(courses, null, 2), "utf8");
            return res.status(200).json({ message: "Course purged from registry file", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: "Purge operation failed", error: err.message, status: 500 });
        }
    }
}

export default FileCourseController;
