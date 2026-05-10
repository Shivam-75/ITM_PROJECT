import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sectionsFilePath = path.join(__dirname, "../../database/sections.json");

class FileSectionController {
    // 📖 Get all sections
    static async getSections(req, res) {
        try {
            const data = await fs.readFile(sectionsFilePath, "utf8");
            const sections = JSON.parse(data || "[]");
            return res.status(200).json({ sections, status: 200 });
        } catch (err) {
            return res.status(500).json({ message: "Failed to read section registry", error: err.message, status: 500 });
        }
    }

    // ➕ Add a section
    static async addSection(req, res) {
        try {
            const { name, course, semester, roomNo, year, strength } = req.body;
            
            if (!name || !course) {
                return res.status(400).json({ message: "Name and Course are required", status: 400 });
            }

            // Read existing data
            const data = await fs.readFile(sectionsFilePath, "utf8");
            const sections = JSON.parse(data || "[]");

            // Create new section object
            const newSection = {
                id: Date.now(),
                name: name.toUpperCase(),
                course: course,
                semester: semester || "",
                roomNo: roomNo || "",
                year: year || "",
                strength: strength || "N/A",
                createdAt: new Date().toISOString()
            };

            // Push and Save
            sections.push(newSection);
            await fs.writeFile(sectionsFilePath, JSON.stringify(sections, null, 2), "utf8");

            return res.status(201).json({ 
                message: "Section successfully committed to registry", 
                data: newSection, 
                status: 201 
            });
        } catch (err) {
            return res.status(500).json({ message: "Failed to write to section registry", error: err.message, status: 500 });
        }
    }

    // ❌ Delete a section
    static async deleteSection(req, res) {
        try {
            const { id } = req.params;
            const data = await fs.readFile(sectionsFilePath, "utf8");
            let sections = JSON.parse(data || "[]");

            const initialLength = sections.length;
            sections = sections.filter(s => s.id !== parseInt(id));

            if (sections.length === initialLength) {
                return res.status(404).json({ message: "Section ID not found", status: 404 });
            }

            await fs.writeFile(sectionsFilePath, JSON.stringify(sections, null, 2), "utf8");
            return res.status(200).json({ message: "Section purged from registry", status: 200 });
        } catch (err) {
            return res.status(500).json({ message: "Purge operation failed", error: err.message, status: 500 });
        }
    }
}

export default FileSectionController;
