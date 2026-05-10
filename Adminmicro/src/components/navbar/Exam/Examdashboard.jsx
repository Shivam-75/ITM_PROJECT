import React from "react";

const Examdashboard = () => {
  /* 🔹 EXAM SUMMARY */
  const exam = {
    examName: "CT Examination",
    subject: "DBMS",
    date: "10 March 2026",
    total: 60,
    present: 52,
    absent: 8,
  };

  /* 🔹 STUDENT ATTENDANCE (D-10 LIST MOCK DATA) */
  const students = [
    { roll: "BCA401", name: "Nihal Pandey", attendance: 82 },
    { roll: "BCA402", name: "Aman Verma", attendance: 76 },
    { roll: "BCA403", name: "Rohit Kumar", attendance: 68 },
    { roll: "BCA404", name: "Saurabh Singh", attendance: 90 },
    { roll: "BCA405", name: "Ankit Yadav", attendance: 72 },
  ];

  const presentPercent = Math.round((exam.present / exam.total) * 100);
  const absentPercent = 100 - presentPercent;

  const eligible = students.filter((s) => s.attendance >= 75);
  const notEligible = students.filter((s) => s.attendance < 75);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="w-full">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Exam & D-10 Attendance Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            {exam.examName} | {exam.subject} | {exam.date}
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-3xl font-bold mt-2">{exam.total}</p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {exam.present}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {exam.absent}
            </p>
          </div>
        </div>

        {/* ATTENDANCE GRAPHS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

          {/* DONUT CHART */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Attendance Distribution
            </h2>

            <div className="flex justify-center">
              <svg width="180" height="180" viewBox="0 0 42 42">
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke="#16A34A"
                  strokeWidth="6"
                  strokeDasharray={`${presentPercent} ${100 - presentPercent}`}
                  strokeDashoffset="25"
                />
              </svg>
            </div>

            <div className="flex justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-600 rounded-full" />
                Present ({presentPercent}%)
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-full" />
                Absent ({absentPercent}%)
              </span>
            </div>
          </div>

          {/* LINE STYLE BAR GRAPH */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-6">
              Present vs Absent (Line View)
            </h2>

            {/* PRESENT LINE */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Present</span>
                <span className="text-green-600 font-semibold">
                  {presentPercent}%
                </span>
              </div>

              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute left-0 top-0 h-2 bg-green-600 rounded-full"
                  style={{ width: `${presentPercent}%` }}
                />
                <div
                  className="absolute -top-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow"
                  style={{ left: `calc(${presentPercent}% - 8px)` }}
                />
              </div>
            </div>

            {/* ABSENT LINE */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Absent</span>
                <span className="text-red-600 font-semibold">
                  {absentPercent}%
                </span>
              </div>

              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute left-0 top-0 h-2 bg-red-600 rounded-full"
                  style={{ width: `${absentPercent}%` }}
                />
                <div
                  className="absolute -top-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow"
                  style={{ left: `calc(${absentPercent}% - 8px)` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* D-10 ELIGIBILITY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-500">Eligible (≥ 75%)</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {eligible.length}
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-gray-500">Not Eligible (&lt; 75%)</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {notEligible.length}
            </p>
          </div>
        </div>

        {/* D-10 LIST */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            D-10 Eligibility List (Attendance Based)
          </h2>

          <table className="w-full text-sm border">
            <thead className="bg-white">
              <tr>
                <th className="border px-3 py-2 text-left">Roll No</th>
                <th className="border px-3 py-2 text-left">Student Name</th>
                <th className="border px-3 py-2 text-center">Attendance %</th>
                <th className="border px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">{s.roll}</td>
                  <td className="border px-3 py-2">{s.name}</td>
                  <td className="border px-3 py-2 text-center">
                    {s.attendance}%
                  </td>
                  <td className="border px-3 py-2 text-center font-semibold">
                    {s.attendance >= 75 ? (
                      <span className="text-green-600">Eligible</span>
                    ) : (
                      <span className="text-red-600">Not Eligible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Examdashboard;




