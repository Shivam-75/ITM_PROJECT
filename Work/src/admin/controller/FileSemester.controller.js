import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../database/semesters.json");

class FileSemesterController {
    // 📖 Get all semesters
    static async getSemesters(req, res) {
        try {
            const data = await fs.readFile(dbPath, "utf8");
            const semesters = JSON.parse(data || "[]");
            res.status(200).json({ status: 200, semesters });
        } catch (err) {
            res.status(500).json({ message: "Failed to read semester registry", error: err.message, status: 500 });
        }
    }

    // ➕ Add a semester
    static async addSemester(req, res) {
        try {
            const { name, startDate, endDate, status } = req.body;
            if (!name) return res.status(400).json({ message: "Semester Name is required", status: 400 });

            // Read existing data
            let semesters = [];
            try {
                const data = await fs.readFile(dbPath, "utf8");
                semesters = JSON.parse(data || "[]");
            } catch (e) {
                // If file doesn't exist, we start with empty array
                semesters = [];
            }

            const newSemester = {
                id: Date.now().toString(),
                name,
                startDate: startDate || "",
                endDate: endDate || "",
                status: status || "Active",
                createdAt: new Date().toISOString()
            };

            semesters.push(newSemester);
            await fs.writeFile(dbPath, JSON.stringify(semesters, null, 2), "utf8");

            res.status(201).json({ message: "Semester successfully committed to registry", status: 201, semester: newSemester });
        } catch (err) {
            res.status(500).json({ message: "Failed to write to registry", error: err.message, status: 500 });
        }
    }

    // ❌ Delete a semester
    static async deleteSemester(req, res) {
        try {
            const { id } = req.params;
            const data = await fs.readFile(dbPath, "utf8");
            let semesters = JSON.parse(data || "[]");

            const initialLength = semesters.length;
            semesters = semesters.filter(s => s.id !== id);

            if (semesters.length === initialLength) {
                return res.status(404).json({ message: "Semester record not found", status: 404 });
            }

            await fs.writeFile(dbPath, JSON.stringify(semesters, null, 2), "utf8");
            res.status(200).json({ message: "Semester record purged successfully", status: 200 });
        } catch (err) {
            res.status(500).json({ message: "Purge operation failed", error: err.message, status: 500 });
        }
    }
}

export default FileSemesterController;
