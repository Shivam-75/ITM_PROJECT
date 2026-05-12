import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import { WorkAPI } from "../api/apis";
import { 
  FiBookOpen, FiEdit3, FiTv, FiBell, FiClock, 
  FiFileText, FiLayers, FiBriefcase, FiArrowRight, 
  FiCheckCircle, FiAward, FiCalendar, FiUser, FiInfo,
  FiActivity, FiZap, FiTarget, FiTrendingUp
} from "react-icons/fi";
import Loader from "../components/common/Loader";

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white border-2 border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, colorClass, path, description, loading }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => path && navigate(path)}
      className="group relative cursor-pointer active:scale-95 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <GlassCard className="relative p-5 rounded-[2rem] h-40 flex flex-col justify-between overflow-hidden group-hover:border-rose-300/50 transition-all duration-300">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${colorClass} text-white group-hover:rotate-6 transition-all duration-500`}>
            <Icon size={20} />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:bg-black group-hover:text-white transition-all duration-300">
            <FiArrowRight size={14} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1 group-hover:text-black transition-colors">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-black tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">
              {loading ? "..." : (value || "0")}
            </h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{description}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const Dashboard = () => {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    homework: 0,
    assignments: 0,
    modelPapers: 0,
    syllabus: 0,
    notices: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [hwRes, assRes, mpRes, sylRes, noteRes] = await Promise.all([
        WorkAPI.get("/HomeWork/getHwDpt"),
        WorkAPI.get("/Assignment/getAssDpt"),
        WorkAPI.get("/ModelPaper/all"),
        WorkAPI.get("/Syllabus/getSyllabus"),
        WorkAPI.get("/Notice/getNoticeDpt")
      ]);

      setCounts({
        homework: Array.isArray(hwRes.data?.data) ? hwRes.data.data.length : 0,
        assignments: Array.isArray(assRes.data?.data) ? assRes.data.data.length : 0,
        modelPapers: Array.isArray(mpRes.data?.data) ? mpRes.data.data.length : 0,
        syllabus: Array.isArray(sylRes.data?.data) ? sylRes.data.data.length : 0,
        notices: Array.isArray(noteRes.data?.data) ? noteRes.data.data.length : 0
      });
    } catch (error) {
      console.error("Failed to fetch dashboard counts", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24">
      
      {/* 🌟 ULTRA-SLIM HERO STRIP */}
      <div className="relative overflow-hidden rounded-[10px] bg-black py-8 px-6 group shadow-xl">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-rose-600 via-pink-600 to-transparent opacity-20 transition-opacity duration-1000"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-24 right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <FiZap className="text-yellow-400 fill-yellow-400" size={10} />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">{getTimeOfDay()}</span>
            </div>
            
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-none">
                Welcome, <span className="text-rose-400">{student?.name?.split(" ")[0] || "Scholar"}</span>
              </h1>
              <p className="hidden sm:block text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">
                {student?.course} • Active Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="px-5 py-2.5 bg-white text-black rounded-xl font-black text-[8px] uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer">
                Achievements
             </div>
          </div>
        </div>
      </div>

      {/* 🚀 MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Section - Academic Modules */}
        <div className="xl:col-span-8 space-y-10">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-black">Academic Modules</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Everything you need to excel</p>
            </div>
            <div className="hidden md:flex items-center gap-4 px-5 py-2 bg-gray-50 border border-gray-100 rounded-full">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Updates Syncing</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Homework" value={counts.homework} icon={FiEdit3} colorClass="bg-black" path="/homework" description="Active Tasks" loading={loading} />
            <StatCard title="Assignments" value={counts.assignments} icon={FiBookOpen} colorClass="bg-rose-600" path="/assignment" description="Pending Submissions" loading={loading} />
            <StatCard title="Model Papers" value={counts.modelPapers} icon={FiFileText} colorClass="bg-pink-600" path="/model-paper" description="Available Resources" loading={loading} />
            <StatCard title="Syllabus" value={counts.syllabus} icon={FiLayers} colorClass="bg-rose-500" path="/Syllbus" description="Study Units" loading={loading} />
            <StatCard title="Time Table" value="LIVE" icon={FiClock} colorClass="bg-indigo-600" path="/timetable" description="Daily Schedule" loading={false} />
            <StatCard title="Attendance" value="92%" icon={FiTrendingUp} colorClass="bg-emerald-600" path="/attendance" description="Current Status" loading={false} />
            <StatCard title="Exam Schedule" value="12" icon={FiCalendar} colorClass="bg-amber-600" path="/exam-schedule" description="Upcoming Dates" loading={false} />
            <StatCard title="Results" value="VIEW" icon={FiAward} colorClass="bg-purple-600" path="/result" description="Academic Record" loading={false} />
            <StatCard title="Placements" value="NEW" icon={FiBriefcase} colorClass="bg-blue-600" path="/placements" description="Opportunities" loading={false} />
          </div>
        </div>

        {/* Right Section - Notices & Support */}
        <div className="xl:col-span-4 space-y-10">
           <GlassCard className="rounded-[3.5rem] p-10 space-y-8 flex flex-col h-full">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
                     <FiBell size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-black">Notices</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{counts.notices} Active Alerts</p>
                  </div>
               </div>
            </div>
            
            <div className="flex-grow space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
               {counts.notices === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                       <FiInfo size={32} className="text-gray-200" />
                    </div>
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em]">No New Alerts</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <p className="text-center text-gray-400 text-xs font-medium py-10">Check the notice board for detailed updates.</p>
                 </div>
               )}
            </div>

            <div className="space-y-4 pt-6">
              <button 
                onClick={() => navigate("/Notice")}
                className="w-full py-6 bg-black text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-2xl shadow-black/20"
              >
                Enter Notice Board <FiArrowRight size={18} />
              </button>

              <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] group/support cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50 group-hover/support:scale-110 transition-transform duration-500">
                       <FiBriefcase size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-tight text-black">Support Desk</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect with Admin</p>
                    </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

