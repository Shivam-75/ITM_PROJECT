import { useState } from "react";
import * as XLSX from "xlsx";

export default function ResultList() {
  const [data, setData] = useState([
    {
      roll: "BCA401",
      DBMS: 8,
      OS: 6,
      CN: 7,
      SE: 8,
      JAVA: 9,
      AI: 6,
      WT: 7,
    },
    {
      roll: "BCA402",
      DBMS: 9,
      OS: 5,
      CN: 6,
      SE: 7,
      JAVA: 8,
      AI: 5,
      WT: 6,
    },
    {
      roll: "BCA403",
      DBMS: 4,
      OS: 6,
      CN: 8,
      SE: 6,
      JAVA: 7,
      AI: 4,
      WT: 5,
    },
  ]);

  // ✅ 7 Subjects
  const subjects = ["DBMS", "OS", "CN", "SE", "JAVA", "AI", "WT"];

  // Delete Row
  const handleDelete = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  // Excel Download
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "Student_Result.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto py-[70px] bg-white p-6 rounded-lg shadow-sm">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Student Result Sheet
            </h2>
            <p className="text-sm text-gray-500">
              Academic Performance Record
            </p>
          </div>

          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            Download Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">
                  Roll No
                </th>

                {subjects.map((sub, i) => (
                  <th key={i} className="border px-3 py-2">
                    <div>{sub}</div>
                    <div className="text-xs text-gray-500">
                      (Out of 10)
                    </div>
                  </th>
                ))}

                <th className="border px-3 py-2">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-semibold text-left">
                    {student.roll}
                  </td>

                  {subjects.map((sub, i) => (
                    <td key={i} className="border px-3 py-2">
                      <div className="font-semibold">
                        {student[sub]}
                      </div>
                      <div
                        className={`text-xs ${
                          student[sub] >= 4
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {student[sub] >= 4 ? "PASS" : "FAIL"}
                      </div>
                    </td>
                  ))}

                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={subjects.length + 2}
                    className="border px-3 py-6 text-red-500 font-medium"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
