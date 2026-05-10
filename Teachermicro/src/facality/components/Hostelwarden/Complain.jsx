import React, { useState } from "react";

const Complain = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      studentName: "Rahul Kumar",
      roomNumber: "A-101",
      type: "Electricity",
      description: "Fan is not working",
      status: "Pending",
      priority: "High",
      date: "12 Feb 2026",
    },
    {
      id: 2,
      studentName: "Amit Singh",
      roomNumber: "B-202",
      type: "Water",
      description: "No water in washroom",
      status: "In Progress",
      priority: "Medium",
      date: "11 Feb 2026",
    },
    {
      id: 3,
      studentName: "Vikas Sharma",
      roomNumber: "A-102",
      type: "Mess",
      description: "Food quality issue",
      status: "Resolved",
      priority: "Low",
      date: "10 Feb 2026",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c
      )
    );
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.roomNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const statusStyle = (status) => {
    if (status === "Pending")
      return "bg-red-100 text-red-600";
    if (status === "In Progress")
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-600";
  };

  const priorityStyle = (priority) => {
    if (priority === "High")
      return "text-red-600 font-semibold";
    if (priority === "Medium")
      return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  return (
    // 🔥 Important Change Here
    <div className="min-h-screen bg-gray-100 pt-24 px-8">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🏨 Hostel Complaint Management
      </h1>

      {/* 🔹 Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by student or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4 shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* 🔹 Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((comp) => (
              <tr
                key={comp.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {comp.studentName}
                </td>

                <td className="px-6 py-4">{comp.roomNumber}</td>

                <td className="px-6 py-4">{comp.type}</td>

                <td className="px-6 py-4">{comp.description}</td>

                <td className={`px-6 py-4 ${priorityStyle(comp.priority)}`}>
                  {comp.priority}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {comp.date}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      comp.status
                    )}`}
                  >
                    {comp.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  <select
                    value={comp.status}
                    onChange={(e) =>
                      updateStatus(comp.id, e.target.value)
                    }
                    className="border rounded-md px-2 py-1 text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}

            {filteredComplaints.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500"
                >
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complain;
