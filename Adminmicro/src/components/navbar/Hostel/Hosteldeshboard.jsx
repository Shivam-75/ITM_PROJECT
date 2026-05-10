import React, { useState, useEffect } from "react";
import axios from "axios";

const Hosteldeshboard = () => {
    const [stats, setStats] = useState({ inHostel: 0, vacant: 0, complaints: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [allocRes, roomsRes, compRes] = await Promise.all([
                    axios.get("http://localhost:5002/api/v3/Admin/Hostel/allocate", { withCredentials: true }),
                    axios.get("http://localhost:5002/api/v3/Admin/Hostel/rooms", { withCredentials: true }),
                    axios.get("http://localhost:5002/api/v3/Admin/Hostel/complaints", { withCredentials: true })
                ]);
                const totalCapacity = roomsRes.data.rooms.reduce((acc, r) => acc + r.capacity, 0);
                const occupied = roomsRes.data.rooms.reduce((acc, r) => acc + r.occupied, 0);
                setStats({
                    inHostel: occupied,
                    vacant: totalCapacity - occupied,
                    complaints: compRes.data.complaints.filter(c => c.status === "Pending").length
                });
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, []);

  const monthlyRevenue = [
    { month: "January", amount: 15352 },
    { month: "February", amount: 16558 },
    { month: "March", amount: 18753 },
  ];

  const satisfaction = [
    { month: "January", percent: 76 },
    { month: "February", percent: 79 },
    { month: "March", percent: 83 },
  ];

  const newStudents = [
    { month: "January", value: 18 },
    { month: "February", value: 26 },
    { month: "March", value: 31 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== TOP HEADER ===== */}
      <div className="bg-teal-700 text-white px-8 py-4 shadow-md">
        <h1 className="text-2xl font-semibold">
          🏨 Hostel Monthly Financial Scorecard
        </h1>
      </div>

      <div className="p-6 grid lg:grid-cols-2 gap-6">

        {/* ================= LEFT PANEL ================= */}
        <div className="bg-teal-600 text-white p-6 rounded-xl shadow-lg">

          {/* Revenue Section */}
          <h2 className="text-lg font-semibold mb-6 text-center">
            💰 Monthly Revenue
          </h2>

          <div className="space-y-6">
            {monthlyRevenue.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.month}</span>
                  <span>₹{item.amount}</span>
                </div>

                <div className="w-full bg-teal-400 h-3 rounded">
                  <div
                    className="bg-white h-3 rounded"
                    style={{
                      width: `${(item.amount / maxRevenue) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Students Overview */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4 text-center">
              👨‍🎓 Students Overview
            </h2>

            <div className="grid grid-cols-3 text-center">
              <div>
                <p className="text-sm">In Hostel</p>
                <p className="text-xl font-bold">{stats.inHostel}</p>
              </div>
              <div>
                <p className="text-sm">Vacant Rooms</p>
                <p className="text-xl font-bold">{stats.vacant}</p>
              </div>
              <div>
                <p className="text-sm">Complaints</p>
                <p className="text-xl font-bold">{stats.complaints}</p>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="space-y-6">

          {/* Satisfaction Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-center font-semibold mb-6 text-gray-700">
              Student Satisfaction
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {satisfaction.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 rounded-full border-[10px] border-gray-200"></div>

                    <div
                      className="absolute inset-0 rounded-full border-[10px] border-teal-600 border-t-transparent rotate-45"
                      style={{
                        clipPath: `inset(0 ${100 - item.percent}% 0 0)`
                      }}
                    ></div>

                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
                      {item.percent}%
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-600">
                    {item.month}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* New Students */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-center font-semibold mb-6 text-gray-700">
              New Hostel Admissions (Last 3 Months)
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              {newStudents.map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <p className="text-3xl font-bold text-teal-700">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.month}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Hosteldeshboard;
