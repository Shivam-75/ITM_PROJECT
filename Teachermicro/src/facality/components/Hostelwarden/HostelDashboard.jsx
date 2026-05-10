import React from "react";
import { FiUsers, FiHome, FiCheckSquare, FiAlertCircle, FiClipboard, FiFileText, FiMapPin } from "react-icons/fi";

const StatCard = ({ title, value, icon, subtext }) => (
  <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-100/40 p-6 flex flex-col group transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            {icon}
        </div>
        <span className="text-[8px] font-black text-slate-200 uppercase tracking-widest italic tracking-tighter shadow-sm px-2 py-1 rounded bg-slate-50">Active Protocol</span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">
      {title}
    </p>
    <div className="flex items-baseline gap-2">
        <p className="text-3xl font-[900] text-slate-900 tracking-tighter">
          {value}
        </p>
        <span className="text-[10px] font-black text-emerald-500 uppercase italic">/ {subtext}</span>
    </div>
  </div>
);

const HostelDashboard = () => {
  const hostelData = {
    totalStudents: 320,
    totalRooms: 150,
    occupiedRooms: 120,
    vacantRooms: 30,
    totalComplaints: 45,
    pendingComplaints: 12,
    totalFines: 18,
    leaveRequests: 9,
  };

  return (
    <div className="min-h-[100dvh] bg-white pt-4 px-2">
      <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 flex items-center gap-4">
        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
        Hostel Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Residents"
          value={hostelData.totalStudents}
          subtext="Capacity 400"
          icon={<FiUsers size={20} />}
        />
        <StatCard
          title="Total Inventory"
          value={hostelData.totalRooms}
          subtext="Rooms"
          icon={<FiHome size={20} />}
        />
        <StatCard
          title="Occupied Space"
          value={hostelData.occupiedRooms}
          subtext="Units"
          icon={<FiCheckSquare size={20} />}
        />
        <StatCard
          title="Vacant Units"
          value={hostelData.vacantRooms}
          subtext="Ready"
          icon={<FiMapPin size={20} />}
        />
        <StatCard
          title="Official Grievances"
          value={hostelData.totalComplaints}
          subtext="Logs"
          icon={<FiAlertCircle size={20} />}
        />
        <StatCard
          title="Pending Action"
          value={hostelData.pendingComplaints}
          subtext="Priority"
          icon={<FiClipboard size={20} />}
        />
        <StatCard
          title="Financial Records"
          value={hostelData.totalFines}
          subtext="Entries"
          icon={<FiFileText size={20} />}
        />
        <StatCard
          title="Exit Protocols"
          value={hostelData.leaveRequests}
          subtext="Requested"
          icon={<FiFileText size={20} />}
        />
      </div>
    </div>
  );
};

export default HostelDashboard;
