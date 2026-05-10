import {
  calculateClassAttendanceSummary,
  calculateStudentSemesterPercentage,
} from "./utils/attendanceUtils";

function ExportAttendance({ attendance, students }) {
  const exportCSV = () => {
    const rows = [];

    /* =====================
       1️⃣ Date-wise Attendance
    ====================== */
    rows.push(["Date", "Student Name", "Status"]);

    Object.keys(attendance).forEach((date) => {
      students.forEach((student) => {
        const isAbsent =
          attendance[date]?.hasOwnProperty(student.id);

        rows.push([
          date,
          student.name,
          isAbsent ? "Absent" : "Present",
        ]);
      });
    });

    rows.push([]);

    /* =====================
       2️⃣ Class Attendance Summary
    ====================== */
    const summary = calculateClassAttendanceSummary(
      attendance,
      students.length
    );

    rows.push(["Attendance Summary (Class)"]);
    rows.push(["Total Present", summary.present]);
    rows.push(["Total Absent", summary.absent]);
    rows.push(["Overall Attendance %", summary.percentage + "%"]);

    rows.push([]);

    /* =====================
       3️⃣ Semester Attendance (Per Student)
    ====================== */
    rows.push(["Student Name", "Attendance %"]);

    students.forEach((student) => {
      const percent =
        calculateStudentSemesterPercentage(
          attendance,
          student.id
        );

      rows.push([
        student.name,
        percent + "%",
      ]);
    });

    /* =====================
       CSV DOWNLOAD
    ====================== */
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-report.csv";
    link.click();
  };

  const exportPDF = () => {
    alert(
      "PDF export ke liye jsPDF ya backend API integrate karna hoga"
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h3 className="font-semibold text-gray-700">
        Export Summary
      </h3>

      <div className="flex gap-3">
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Export CSV
        </button>

        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}

export default ExportAttendance;
