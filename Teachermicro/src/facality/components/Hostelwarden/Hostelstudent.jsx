import React, { useEffect, useState } from "react";

const HostelStudent = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Simulating Backend Fetch
  useEffect(() => {
    const dummyStudents = [
      {
        id: 1,
        name: "Rahul Kumar",
        room: "A-101",
        course: "B.Tech CSE",
        year: "3rd Year",
        contact: "9876543210",
      },
      {
        id: 2,
        name: "Amit Singh",
        room: "B-202",
        course: "BCA",
        year: "2nd Year",
        contact: "9123456780",
      },
      {
        id: 3,
        name: "Vikas Sharma",
        room: "A-102",
        course: "B.Tech ECE",
        year: "4th Year",
        contact: "9988776655",
      },
      {
        id: 4,
        name: "Sohan Verma",
        room: "B-201",
        course: "MBA",
        year: "1st Year",
        contact: "9871234560",
      },
      {
        id: 5,
        name: "Priya Sharma",
        room: "C-301",
        course: "B.Sc",
        year: "2nd Year",
        contact: "9012345678",
      },
    ];

    setStudents(dummyStudents);
  }, []);

  // 🔹 Search Filter
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.room.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Delete Student
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-8">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🎓 Hostel Students
      </h1>

      {/* 🔹 Summary Card */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-8 w-full md:w-1/3">
        <p className="text-sm uppercase opacity-80">
          Total Students in Hostel
        </p>
        <p className="text-3xl font-bold mt-2">
          {students.length}
        </p>
      </div>

      {/* 🔹 Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm"
        />
      </div>

      {/* 🔹 Students Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-white transition"
              >
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {student.name}
                </td>
                <td className="px-6 py-4">{student.room}</td>
                <td className="px-6 py-4">{student.course}</td>
                <td className="px-6 py-4">{student.year}</td>
                <td className="px-6 py-4 text-gray-600">
                  {student.contact}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredStudents.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default HostelStudent;



