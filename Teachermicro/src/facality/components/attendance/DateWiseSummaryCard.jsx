import { useMemo } from "react";
import {
  getPresentAbsentCountByDate,
  calculateDailyPercentage,
} from "./utils/attendanceUtils";

function DateWiseSummaryCard({
  attendance,
  selectedDate,
  totalStudents, // ✅ FIX 1
}) {
  // ✅ Present / Absent count
  const { present, absent } = useMemo(
  () =>
    getPresentAbsentCountByDate(
      attendance,
      selectedDate,
      totalStudents
    ),
  [attendance, selectedDate, totalStudents]
);

  // ✅ Daily percentage (NOW USED)
  const dailyPercentage = useMemo(
    () =>
      calculateDailyPercentage(
        attendance,
        selectedDate,
        totalStudents
      ),
    [attendance, selectedDate, totalStudents]
  );

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h3 className="font-semibold text-gray-700">
        Date-wise Summary
      </h3>

      <p className="text-sm text-gray-500">
        Date:{" "}
        <span className="font-medium">
          {selectedDate || "Not Selected"}
        </span>
      </p>

      <div className="flex justify-between text-sm">
        <span className="text-green-600">Present</span>
        <span className="font-bold">{present}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-red-600">Absent</span>
        <span className="font-bold">{absent}</span>
      </div>

      {/* ✅ DAILY PERCENTAGE (FIXED) */}
      <div className="flex justify-between pt-2 border-t text-sm">
        <span className="font-semibold text-gray-700">
          Daily Attendance %
        </span>

        <span
          className={`font-bold ${
            dailyPercentage >= 75
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {dailyPercentage}%
        </span>
      </div>
    </div>
  );
}

export default DateWiseSummaryCard;
