// admin/AdminCommon/AdminStudentCommon/studentExcelUtils.js
import * as XLSX from "xlsx";

/**
 * Exports students array to an Excel file.
 * Columns cover the fields shown in the table + many form fields.
 */
export function exportStudentsToExcel(students = []) {
  // define headers & order (what will appear in the sheet)
  const headers = [
    "Student ID",
    "Roll No",
    "Name",
    "Name Hindi",
    "Email",
    "Phone",
    "Parent Name",
    "Parent Contact",
    "Course",
    "Class",
    "Year",
    "Status",
    "Admission Date",
    "Aadhaar",
    "Gender",
    "DOB",
    "Address",
    "Pin Code",
    "Qualification Type",
    "Marks Total",
    "Marks Obtained",
    "Maths Marks",
    "Physics Marks",
    "Chemistry Marks",
    "PassOut",
  ];

  const rows = students.map((s) => {
    return {
      "Student ID": s.studentId ?? "",
      "Roll No": s.rollNo ?? "",
      "Name": s.name ?? "",
      "Name Hindi": s.nameHindi ?? "",
      "Email": s.studentEmail ?? s.email ?? "",
      "Phone": s.phone ?? "",
      "Parent Name": (s.fatherName || s.motherName || "") ,
      "Parent Contact": s.parentMobile ?? s.parentContact ?? "",
      "Course": s.course ?? "",
      "Class": s.className ?? s.course ?? "",
      "Year": s.year ?? "",
      "Status": s.status ?? "",
      "Admission Date": s.admissionDate ?? "",
      "Aadhaar": s.aadhaar ?? "",
      "Gender": s.gender ?? "",
      "DOB": s.dob ?? "",
      "Address": s.address ?? "",
      "Pin Code": s.pinCode ?? "",
      "Qualification Type": s.qualificationType ?? "",
      "Marks Total": s.maxMarksTotal ?? "",
      "Marks Obtained": s.marksObtainedTotal ?? "",
      "Maths Marks": s.mathsMarks ?? "",
      "Physics Marks": s.physicsMarks ?? "",
      "Chemistry Marks": s.chemistryMarks ?? "",
      "PassOut": (!!s.isPassOut || !!s.passOut) ? "Yes" : "No",
    };
  });

  // convert to worksheet
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  // create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  // write file (browser download)
  const filename = `students_export_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Parse uploaded excel file (File object) and return array of student objects
 * - accepts common header names (case-insensitive)
 * - normalizes dates to YYYY-MM-DD strings
 */
export async function parseStudentsExcel(file) {
  if (!file) return [];

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  // parse to JSON using header row as keys
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  // build a header normalization map (lowercase without spaces/punct)
  const normalizeKey = (k = "") =>
    String(k).toLowerCase().replace(/[^a-z0-9]/g, "");

  // mapping common header names to our internal fields
  const headerToField = {
    studentid: "studentId",
    "stdid": "studentId",
    rollno: "rollNo",
    name: "name",
    namehindi: "nameHindi",
    email: "studentEmail",
    phone: "phone",
    parentname: "fatherName", // we'll fill fatherName with Parent Name
    parentcontact: "parentMobile",
    course: "course",
    class: "className",
    year: "year",
    status: "status",
    admissiondate: "admissionDate",
    aadhaar: "aadhaar",
    gender: "gender",
    dob: "dob",
    address: "address",
    pincode: "pinCode",
    qualificationtype: "qualificationType",
    markstotal: "maxMarksTotal",
    marksobtained: "marksObtainedTotal",
    mathmarks: "mathsMarks",
    mathmarksfull: "mathsMarks",
    physicsmarks: "physicsMarks",
    chemistrymarks: "chemistryMarks",
    passout: "isPassOut",
  };

  // transform each row to student object
  const parsed = raw.map((row, idx) => {
    const obj = {};
    for (const key of Object.keys(row)) {
      const nk = normalizeKey(key);
      const field = headerToField[nk];
      const val = row[key];

      if (!field) {
        // ignore unknown columns
        continue;
      }

      // normalize boolean / yes-no
      if (field === "isPassOut") {
        const v = String(val).trim().toLowerCase();
        obj.isPassOut = v === "yes" || v === "true" || v === "1";
        continue;
      }

      // date normalization: if looks like a date or Excel serial
      if (field === "admissionDate" || field === "dob") {
        // XLSX may parse strings or dates — try Date parse
        let dateStr = "";
        if (val instanceof Date) {
          dateStr = val.toISOString().slice(0, 10);
        } else if (typeof val === "number") {
          // Excel date serial -> convert
          const date = XLSX.SSF.parse_date_code(val);
          if (date) {
            const d = new Date(Date.UTC(date.y, date.m - 1, date.d));
            dateStr = d.toISOString().slice(0, 10);
          }
        } else {
          // string
          const parsedDate = new Date(String(val));
          if (!Number.isNaN(parsedDate.getTime())) {
            dateStr = parsedDate.toISOString().slice(0, 10);
          } else {
            dateStr = String(val).trim();
          }
        }
        obj[field] = dateStr;
        continue;
      }

      // numeric -> string for rollNo/id
      if (field === "rollNo" || field === "studentId" || field === "pinCode") {
        obj[field] = String(val).trim();
        continue;
      }

      // normal assignment
      obj[field] = typeof val === "string" ? val.trim() : val;
    }

    // ensure at least name exists
    if (!obj.name || obj.name === "") {
      // skip rows missing name
      return null;
    }

    // ensure studentId present: if missing, generate a temporary one
    if (!obj.studentId || obj.studentId === "") {
      obj.studentId = `GEN-${Date.now()}-${idx}`;
    }

    // set createdAt/updatedAt metadata for bulkAdd
    obj.createdAt = new Date().toISOString();
    obj.updatedAt = obj.createdAt;

    return obj;
  });

  // filter out null rows (missing name)
  return parsed.filter(Boolean);
}
