import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { 
  FiBookOpen, FiEdit3, FiTv, FiBell, FiClock, 
  FiFileText, FiLayers, FiBriefcase, FiArrowRight, 
  FiCheckCircle, FiAward, FiCalendar
} from "react-icons/fi";

const StatTile = ({ title, value, icon: Icon, colorClass, path }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => path && navigate(path)}
      className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group cursor-pointer relative overflow-hidden active:scale-95"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${colorClass}`}></div>
      <div className="flex justify-between items-start relative z-10">
          <div className={`w-14 h-14 rounded-lg flex items-center justify-center shadow-xl ${colorClass} text-white group-hover:scale-110 transition-transform duration-500`}>
             <Icon size={24} />
          </div>
          <FiArrowRight className="text-gray-200 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
      </div>
      <div className="mt-8 relative z-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 italic">
            {title}
          </p>
          <p className="text-4xl font-black text-gray-900 leading-none tracking-tighter italic">
            {value}
          </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { student } = useAuth();

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      {/* 🔹 Premium Hero Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-lg text-gray-900 border border-slate-100 shadow-sm relative overflow-hidden shadow-2xl shadow-gray-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full -mr-20 -mt-20 blur-[100px] opacity-20"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-lg italic backdrop-blur-md border border-white/5">Student Control Panel</span>
             <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                <FiCheckCircle size={10} /> Identity Verified
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Welcome, <span className="text-red-600">{student?.name?.split(' ')[0] || "Scholar"}</span>
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-xl">
            You are currently enrolled in the <span className="text-white">{student?.course || "Academic"} Program.</span> Access your learning modules below.
          </p>
        </div>

        <div className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-lg shadow-xl text-xs font-black text-white uppercase tracking-widest italic backdrop-blur-xl group hover:bg-red-600 hover:border-red-500 transition-all cursor-default relative z-10">
           <FiCalendar className="text-red-500 group-hover:text-white group-hover:scale-125 transition-all" />
           {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* 🔹 STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        <StatTile title="Homework" value="12" icon={FiEdit3} colorClass="bg-red-600" path="/homework" />
        <StatTile title="Assignments" value="08" icon={FiBookOpen} colorClass="bg-[#111111]" path="/assignment" />
        <StatTile title="Live Classes" value="24" icon={FiTv} colorClass="bg-gray-400" path="/online" />
        <StatTile title="Notifications" value="05" icon={FiBell} colorClass="bg-red-900" path="/Notice" />
      </div>

      {/* 🔹 SECONDARY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        
        {/* Recent Updates */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-100 shadow-sm p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                <FiBell className="text-red-600" />
                Live Timeline
             </h2>
             <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors italic">View Archive</button>
          </div>
          <div className="space-y-6">
             {[1, 2].map((i) => (
                <div key={i} className="flex gap-6 p-6 rounded-lg border border-slate-50 bg-white/30 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group">
                   <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                      <FiBell className="text-red-600" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-gray-900 uppercase italic tracking-tight">New Mathematics assignment posted</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Due in 3 days • Posted by Prof. Sharma</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-[#111111] rounded-lg p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200 group">
           <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 bg-red-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="relative z-10 space-y-8">
              <div className="p-4 bg-white/10 w-fit rounded-lg border border-white/5 backdrop-blur-md">
                 <FiBriefcase size={28} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Scholar Support</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Having technical difficulties? Contact our academic infrastructure desk.</p>
              <button className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-lg shadow-xl hover:bg-red-600 hover:text-white transition-all italic">Launch Protocol</button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;



