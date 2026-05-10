import React, { useEffect, useState } from "react";

const HostelReport = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    date: "",
    status: "Open",
  });

  // 🔹 Simulate Backend Data
  useEffect(() => {
    const dummyReports = [
      {
        id: 1,
        title: "Water Leakage Issue",
        description: "Leakage found in Block A washroom.",
        date: "10 Feb 2026",
        status: "Open",
      },
      {
        id: 2,
        title: "Mess Food Quality",
        description: "Students reported poor food quality.",
        date: "09 Feb 2026",
        status: "In Review",
      },
      {
        id: 3,
        title: "Electricity Problem",
        description: "Frequent power cuts in Block B.",
        date: "08 Feb 2026",
        status: "Resolved",
      },
    ];

    setReports(dummyReports);
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setNewReport({
      ...newReport,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Add Report
  const handleAddReport = () => {
    if (!newReport.title || !newReport.description || !newReport.date) {
      alert("Please fill all fields!");
      return;
    }

    const reportData = {
      id: Date.now(),
      ...newReport,
    };

    setReports([...reports, reportData]);

    setNewReport({
      title: "",
      description: "",
      date: "",
      status: "Open",
    });
  };

  // 🔹 Delete Report
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this report?"))
      return;

    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  // 🔹 Filter Reports
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (status) => {
    if (status === "Open")
      return "bg-red-100 text-red-600";
    if (status === "In Review")
      return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📋 Hostel Warden Reports
      </h1>

      {/* 🔹 Summary */}
      <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg mb-8 w-full md:w-1/3">
        <p className="text-sm uppercase opacity-80">
          Total Reports
        </p>
        <p className="text-3xl font-bold mt-2">
          {reports.length}
        </p>
      </div>

      {/* 🔹 Add Report Form */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Add New Report
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Report Title"
            value={newReport.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newReport.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="date"
            value={newReport.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={newReport.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={handleAddReport}
            className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 col-span-full md:col-span-1"
          >
            Add Report
          </button>
        </div>
      </div>

      {/* 🔹 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search report by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm"
        />
      </div>

      {/* 🔹 Reports Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-800 text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-semibold">
                  {report.title}
                </td>
                <td className="px-6 py-4">
                  {report.description}
                </td>
                <td className="px-6 py-4">
                  {report.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredReports.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostelReport;
