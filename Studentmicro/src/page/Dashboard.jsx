import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiBookOpen, FiEdit3, FiTv, FiBell, FiClock, 
  FiFileText, FiLayers, FiBriefcase, FiArrowRight, 
  FiCheckCircle, FiAward 
} from "react-icons/fi";

const StatTile = ({ title, value, icon: Icon, colorClass, path }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => path && navigate(path)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer relative overflow-hidden active:scale-95"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${colorClass}`}></div>
      <div className="flex justify-between items-start relative z-10">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${colorClass} text-white`}>
             <Icon size={22} />
          </div>
          <FiArrowRight className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" size={18} />
      </div>
      <div className="mt-6 relative z-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 leading-none">
            {value}
          </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 space-y-10">

      {/* 🔹 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back! 👋
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Here's what's happening with your academic profile today.
            </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
           <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Active Session</span>
        </div>
      </div>

      {/* 🔹 STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatTile title="Homework" value="12" icon={FiEdit3} colorClass="bg-indigo-600" path="/homework" />
        <StatTile title="Assignments" value="08" icon={FiBookOpen} colorClass="bg-blue-600" path="/assignment" />
        <StatTile title="Live Classes" value="24" icon={FiTv} colorClass="bg-violet-600" path="/online" />
        <StatTile title="Notifications" value="05" icon={FiBell} colorClass="bg-rose-600" path="/Notice" />
        
        <StatTile title="Time Table" value="01" icon={FiClock} colorClass="bg-emerald-600" path="/timetable" />
        <StatTile title="Attendance" value="84%" icon={FiCheckCircle} colorClass="bg-teal-600" path="/attendance" />
        <StatTile title="Exam Results" value="02" icon={FiAward} colorClass="bg-amber-500" path="/result" />
        <StatTile title="Model Papers" value="06" icon={FiFileText} colorClass="bg-orange-600" path="/model-paper" />

        <StatTile title="Syllabus" value="08" icon={FiLayers} colorClass="bg-cyan-600" path="/Syllbus" />
        <StatTile title="Subject List" value="07" icon={FiBriefcase} colorClass="bg-slate-800" />
      </div>

      {/* 🔹 SECONDARY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Updates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-900">Recent Updates</h2>
             <button className="text-sm font-semibold text-indigo-600 hover:underline">See timeline</button>
          </div>
          <div className="space-y-4">
             {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/30">
                   <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                      <FiBell className="text-slate-400" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">New Mathematics assignment posted</p>
                      <p className="text-xs text-slate-500 mt-1">Due in 3 days • Posted by Prof. Sharma</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
           <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/10 rounded-full blur-2xl"></div>
           <div className="relative z-10 space-y-6">
              <h2 className="text-xl font-bold">Student Support</h2>
              <p className="text-indigo-100 text-sm leading-relaxed">Having trouble with your profile? Contact our academic support desk.</p>
              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-colors">Contact Support</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
