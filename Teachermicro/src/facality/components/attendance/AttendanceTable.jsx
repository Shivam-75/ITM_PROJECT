import React from "react";
import { markAttendanceByDate } from "./utils/attendanceUtils";

function AttendanceTable({
  students,
  attendance,
  setAttendance,
  selectedDate,
}) {
  const handleToggle = (studentId) => {
    setAttendance((prev) =>
      markAttendanceByDate(prev, selectedDate, studentId)
    );
  };

  return (
    <table className="min-w-full bg-white border rounded-[10px]">
      <thead className="bg-white">
        <tr>
           <th className="p-3 text-left">Roll Number</th>
          <th className="p-3 text-left">Student</th>
          <th className="p-3 text-center">Status</th>
        </tr>
      </thead>

      <tbody>
        {students.map((student) => {
          const isAbsent =
  attendance[selectedDate]?.[student.id] === false;

          return (
            <tr key={student.id} className="border-t">
              <td className="p-3">{student.id}</td>
              <td className="p-3">{student.name}</td>
              <td className="p-3 text-center">
               <button
  onClick={() => handleToggle(student.id)}
  className={`px-4 py-1 rounded-[10px] text-sm font-medium
    ${
      isAbsent
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`}
>
  {isAbsent ? "Absent" : "Present"}
</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default React.memo(AttendanceTable);



