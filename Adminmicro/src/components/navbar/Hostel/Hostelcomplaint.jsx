import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Hostelcomplaint = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/api/v3/Admin/Hostel/complaints", { withCredentials: true });
      if (response.data.complaints) setComplaintsData(response.data.complaints);
    } catch (err) { toast.error("Failed to fetch complaints"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 🔎 Filter Logic
  const filteredComplaints = useMemo(() => {
    return complaintsData.filter((item) => {
      return (
        (item.studentId?.toLowerCase().includes(search.toLowerCase()) || 
         item.studentName?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? item.status === statusFilter : true)
      );
    });
  }, [search, statusFilter, complaintsData]);

  // 📊 Summary Counts
  const total = complaintsData.length;
  const open = complaintsData.filter((c) => c.status === "Pending" || c.status === "Open").length;
  const resolved = complaintsData.filter((c) => c.status === "Resolved").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Complaints</h1>
        <p className="text-gray-500">Manage and track hostel maintenance complaints</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
          <p className="text-sm">Total Complaints</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>
        <div className="bg-red-500 text-white rounded-xl p-5 shadow">
          <p className="text-sm">Open/Pending</p>
          <h2 className="text-2xl font-bold">{open}</h2>
        </div>
        <div className="bg-green-600 text-white rounded-xl p-5 shadow">
          <p className="text-sm">Resolved</p>
          <h2 className="text-2xl font-bold">{resolved}</h2>
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaint Table */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Student</th>
              <th className="p-3">Room</th>
              <th className="p-3">Complaint</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading...</td></tr>
            ) : filteredComplaints.length === 0 ? (
              <tr><td colSpan="5" className="p-5 text-center text-gray-500">No complaints found</td></tr>
            ) : (
              filteredComplaints.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium">{item.studentName}</p>
                    <p className="text-xs text-gray-500">{item.studentId}</p>
                  </td>
                  <td className="p-3">{item.roomNo}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Pending" ? "bg-red-100 text-red-700" : item.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hostelcomplaint;
