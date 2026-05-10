import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Hostelfee = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [allocRes, structRes] = await Promise.all([
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/allocate", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Fee/structure", { withCredentials: true })
            ]);
            
            const allocations = allocRes.data.allocations || [];
            const structures = structRes.data.structures || [];
            
            const combined = allocations.map(a => {
                const struct = structures.find(s => s.courseName?.toLowerCase() === a.course?.toLowerCase()) || { hostelFee: 65000 };
                return {
                    ...a,
                    totalHostelFee: struct.hostelFee || 65000,
                    paid: 0, // In real world, fetch payments
                    status: "Pending"
                };
            });
            setData(combined);
        } catch (err) {
            toast.error("Failed to fetch hostel fee data");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // 🔎 Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((student) => {
      return (
        (student.studentId?.toLowerCase().includes(search.toLowerCase()) || 
         student.studentName?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? student.status === statusFilter : true)
      );
    });
  }, [search, statusFilter, data]);

  // 📊 Summary Calculations
  const totalStudents = data.length;
  const totalRevenue = data.reduce((sum, s) => sum + s.totalHostelFee, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Fee Management</h1>
        <p className="text-gray-500">Manage hostel fee records for all allocated students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
          <p className="text-sm">Allocated Students</p>
          <h2 className="text-2xl font-bold">{totalStudents}</h2>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-5 shadow">
          <p className="text-sm">Total Projected Revenue</p>
          <h2 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Room</th>
              <th className="p-3">Fee Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="5" className="p-5 text-center text-gray-500">No records found</td></tr>
            ) : (
              filteredData.map((student, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {student.studentName}
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </td>
                  <td className="p-3 capitalize">{student.course}</td>
                  <td className="p-3">Room {student.roomNo}</td>
                  <td className="p-3 font-semibold">₹{student.totalHostelFee.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {student.status}
                    </span>
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

export default Hostelfee;
