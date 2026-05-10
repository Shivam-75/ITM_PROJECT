import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../database/years.json");

class FileYearController {
    // 📖 Get all years
    static async getYears(req, res) {
        try {
            const data = await fs.readFile(dbPath, "utf8");
            const years = JSON.parse(data || "[]");
            res.status(200).json({ status: 200, years });
        } catch (err) {
            res.status(500).json({ message: "Failed to read year registry", error: err.message, status: 500 });
        }
    }

    // ➕ Add a year
    static async addYear(req, res) {
        try {
            const { name, status } = req.body;
            if (!name) return res.status(400).json({ message: "Year Name is required", status: 400 });

            let years = [];
            try {
                const data = await fs.readFile(dbPath, "utf8");
                years = JSON.parse(data || "[]");
            } catch (e) {
                years = [];
            }

            const newYear = {
                id: Date.now().toString(),
                name,
                status: status || "Active",
                createdAt: new Date().toISOString()
            };

            years.push(newYear);
            await fs.writeFile(dbPath, JSON.stringify(years, null, 2), "utf8");

            res.status(201).json({ message: "Academic Year successfully committed to registry", status: 201, year: newYear });
        } catch (err) {
            res.status(500).json({ message: "Failed to write to registry", error: err.message, status: 500 });
        }
    }

    // ❌ Delete a year
    static async deleteYear(req, res) {
        try {
            const { id } = req.params;
            const data = await fs.readFile(dbPath, "utf8");
            let years = JSON.parse(data || "[]");

            const initialLength = years.length;
            years = years.filter(y => y.id !== id);

            if (years.length === initialLength) {
                return res.status(404).json({ message: "Year record not found", status: 404 });
            }

            await fs.writeFile(dbPath, JSON.stringify(years, null, 2), "utf8");
            res.status(200).json({ message: "Year record purged successfully", status: 200 });
        } catch (err) {
            res.status(500).json({ message: "Purge operation failed", error: err.message, status: 500 });
        }
    }
}

export default FileYearController;
