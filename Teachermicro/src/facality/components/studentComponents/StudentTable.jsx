
import { memo } from "react";
import StudentRow from "./StudentRow"
const StudentTable = ({ students })=> {
  if (students.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        No students found
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-white">
            <tr>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {students.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-lg shadow space-y-1"
          >
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-gray-500">{s.roll}</p>
            <p className="text-sm">{s.className}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(StudentTable);


