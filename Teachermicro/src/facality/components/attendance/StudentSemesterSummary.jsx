import { useMemo } from "react";
import { calculateStudentSemesterPercentage } from "./utils/attendanceUtils";

function StudentSemesterSummary({ students, attendance }) {
  
  const summary = useMemo(() => {
    return students.map((student) => ({
      ...student,
      percentage: calculateStudentSemesterPercentage(
        attendance,
        student.id
      ),
    }));
  }, [attendance, students]);

  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="font-semibold mb-4">
        Semester Attendance (Per Student)
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Student</th>
            <th className="text-right py-2">%</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((s) => (
            <tr key={s.id} className="border-b">
              <td className="py-2">{s.name}</td>
              <td
                className={`py-2 text-right font-bold ${
                  s.percentage >= 75
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {s.percentage}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentSemesterSummary;
