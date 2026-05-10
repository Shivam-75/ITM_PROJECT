// facultyExcelUtils.js
// ---------------------
// Utility functions for importing and exporting Faculty data via Excel (XLSX / CSV)
// Designed to be used by UploadFacultyExcel & ExportFacultyExcel components

/*
  Libraries required (install once):
  npm install xlsx file-saver
*/

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { facultySchema } from "./facultyValidationSchemas";

/**
 * Parse Excel/CSV file into JSON
 * --------------------------------
 * Used before bulk upload to backend
 *
 * Flow:
 * File → Sheet → JSON → Validation → Clean Data
 */
export async function parseFacultyExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Validate each row using Yup schema
        const validated = [];
        for (let i = 0; i < rawJson.length; i++) {
          try {
            const validRow = await facultySchema.validate(rawJson[i], {
              abortEarly: false,
            });
            validated.push(validRow);
          } catch (err) {
            err.row = i + 2; // Excel row (1-based + header)
            throw err;
          }
        }

        resolve(validated);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export Faculty JSON data to Excel file
 * -------------------------------------
 */
export function exportFacultyToExcel(data, fileName = "faculty.xlsx") {
  if (!data || data.length === 0) {
    throw new Error("No data available for export");
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, fileName);
}

/**
 * Interview Notes:
 * ---------------
 * - Excel parsing should be done client-side for preview & validation
 * - Final validation must still happen on server
 * - For very large files, parsing should be offloaded to backend
 */
