import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

const Hostelstudent = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5002/api/v3/Admin/Hostel/allocate", { withCredentials: true });
        if (response.data.allocations) setStudentsData(response.data.allocations);
      } catch (err) { toast.error("Failed to fetch hostelers"); }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);
 
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this student from hostel? This will free up the room capacity.")) return;
    try {
      await axios.delete(`http://localhost:5002/api/v3/Admin/Hostel/allocate/${id}`, { withCredentials: true });
      toast.success("Student removed from hostel");
      setStudentsData(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  // 🔎 Filter Logic
  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      return (
        (student.studentId?.toLowerCase().includes(search.toLowerCase()) || 
         student.studentName?.toLowerCase().includes(search.toLowerCase())) &&
        (courseFilter ? student.course === courseFilter : true)
      );
    });
  }, [search, courseFilter, studentsData]);

  const total = studentsData.length;
  const active = studentsData.filter(s => s.status === "Active").length;
  const vacated = studentsData.filter(s => s.status === "Left").length;

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Students</h1>
        <p className="text-gray-500">Manage all hostel allocated students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Total Students</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>
        <div className="bg-green-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Active Students</p>
          <h2 className="text-2xl font-bold">{active}</h2>
        </div>
        <div className="bg-red-500 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Vacated/Left</p>
          <h2 className="text-2xl font-bold">{vacated}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by Name or ID..."
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-3 rounded-lg"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">Filter by Course</option>
            {[...new Set(studentsData.map(s => s.course))].map(c => (
                <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-3">Name</th>
              <th className="p-3">Student ID</th>
              <th className="p-3">Course</th>
              <th className="p-3">Room No</th>
              <th className="p-3">Join Date</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="text-center p-5">Loading...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="6" className="p-5 text-center text-gray-500">No students found</td></tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={index} className="border-b hover:bg-white">
                  <td className="p-3 font-medium">{student.studentName}</td>
                  <td className="p-3">{student.studentId}</td>
                  <td className="p-3 capitalize">{student.course}</td>
                  <td className="p-3">{student.roomNo}</td>
                  <td className="p-3">{new Date(student.joiningDate).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hostelstudent;




