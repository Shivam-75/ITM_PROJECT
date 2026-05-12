import { useMemo } from "react";
import { calculateClassAttendanceSummary } from "./utils/attendanceUtils";

function AttendanceSummary({ attendance, totalStudents }) {
  // ✅ Class-level summary (ALL dates)
  const { present, absent, percentage } = useMemo(
    () =>
      calculateClassAttendanceSummary(
        attendance,
        totalStudents
      ),
    [attendance, totalStudents]
  );

  return (
    <div className="bg-white p-4 rounded-[10px] border space-y-3">
      {/* Header */}
      <h3 className="font-semibold text-gray-700">
        Attendance Summary (Class)
      </h3>

      {/* Present */}
      <div className="flex justify-between text-sm">
        <span className="text-green-600">Total Present</span>
        <span className="font-bold">{present}</span>
      </div>

      {/* Absent */}
      <div className="flex justify-between text-sm">
        <span className="text-red-600">Total Absent</span>
        <span className="font-bold">{absent}</span>
      </div>

      <hr />

      {/* Overall Percentage */}
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">
          Overall Attendance %
        </span>

        <span
          className={`font-bold ${
            percentage >= 75
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default AttendanceSummary;



