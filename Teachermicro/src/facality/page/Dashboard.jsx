import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { authAPI, ReportAPI, WorkAPI } from "../api/apis";
import { 
  FiUsers, FiBookOpen, FiClock, FiCheckSquare, 
  FiCalendar, FiMessageCircle, FiTrendingUp, FiArrowRight, FiShield, FiZap 
} from "react-icons/fi";
import Loader from "../common/Loader";
import { NavLink } from "react-router-dom";

const StatCard = memo(({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white shadow-xl ${colorClass} group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={26} />
      </div>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">{trend || "+0%"}</span>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{title}</p>
    </div>
  </div>
));

const LiveScheduleItem = ({ lecture, isLast }) => {
  // Logic to determine if a lecture is "Ongoing" or "Upcoming" (Dummy for now)
  const isOngoing = lecture.time.toLowerCase().includes("10:30") || lecture.time.toLowerCase().includes("am"); // Placeholder logic

  return (
    <div className={`relative flex gap-6 p-6 transition-all duration-300 group hover:bg-white/80 rounded-lg ${!isLast ? 'mb-2' : ''}`}>
      {/* Time Column */}
      <div className="flex flex-col items-center min-w-[80px]">
         <span className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter">{lecture.time.split('-')[0]}</span>
         <div className={`w-0.5 h-full my-2 bg-gradient-to-b ${isLast ? 'from-slate-100 to-transparent' : 'from-slate-100 via-slate-200 to-slate-100'} group-hover:via-indigo-200`}></div>
      </div>

      {/* Content Card */}
      <div className="flex-1 flex items-center justify-between gap-4">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                  {lecture.subject}
               </h4>
               {isOngoing && (
                 <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">
                   <FiZap size={8} /> Live Now
                 </span>
               )}
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-500 rounded-lg group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                  <FiUsers size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{lecture.info}</span>
               </div>
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-white transition-colors border border-transparent group-hover:border-indigo-100">
                  <FiClock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{lecture.time}</span>
               </div>
            </div>
         </div>

         <button className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:shadow-lg group-hover:shadow-indigo-50 transition-all active:scale-90">
            <FiArrowRight />
         </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({
    students: 0,
    homework: 0,
    assignments: 0,
    timeTable: []
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      setProfile(profileRes.data?.userData);

      const [studentsRes, hwRes, assRes, ttRes] = await Promise.all([
        authAPI.get("/StudentList"),
        WorkAPI.get("/Homework/uploader"),
        WorkAPI.get("/Assignment/uploader"),
        ReportAPI.get("/TimeTable/uploader")
      ]);

      setStats({
        students: studentsRes.data?.studentList?.length || 0,
        homework: hwRes.data?.data?.length || 0,
        assignments: assRes.data?.data?.length || 0,
        timeTable: ttRes.data?.data || []
      });
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const todayClasses = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    let schedule = [];
    
    stats.timeTable.forEach(table => {
       const todaySheet = table.timeSheet.filter(s => s.day === today);
       todaySheet.forEach(s => {
          s.lectures.forEach(l => {
             schedule.push({
                subject: l.subject,
                time: l.time,
                info: `${table.course.toUpperCase()} - ${table.section.toUpperCase()}`
             });
          });
       });
    });
    return schedule;
  }, [stats.timeTable]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-lg text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-lg italic backdrop-blur-md border border-white/5">Faculty Control Panel</span>
             <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                <FiShield size={10} /> Authenticated Access
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
            Welcome, {profile?.name?.split(' ')[0] || "Professor"}
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] leading-loose max-w-xl">
            You are currently managing the <span className="text-white">{profile?.course || "Academic"} Department.</span> Access all pedagogical tools below.
          </p>
        </div>

        <div className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-lg shadow-xl text-xs font-black text-white uppercase tracking-widest italic backdrop-blur-xl group hover:bg-indigo-600 hover:border-indigo-500 transition-all cursor-default relative z-10">
           <FiCalendar className="text-indigo-400 group-hover:text-white group-hover:scale-125 transition-all" />
           {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Students" value={stats.students} icon={FiUsers} colorClass="bg-indigo-600" trend="+4%" />
        <StatCard title="Assignments" value={stats.assignments} icon={FiCheckSquare} colorClass="bg-rose-600" trend="+2%" />
        <StatCard title="Classes Today" value={todayClasses.length} icon={FiClock} colorClass="bg-emerald-600" />
        <StatCard title="Homework Sets" value={stats.homework} icon={FiBookOpen} colorClass="bg-slate-900" />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PREMIUM LIVE SCHEDULE TIMELINE */}
        <div className="lg:col-span-8 bg-white rounded-lg p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-3">
                     <FiTrendingUp className="text-indigo-600" />
                     Live Academic Schedule
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking your current day lecture capacity</p>
              </div>
              <NavLink to="/timetable" className="px-5 py-2.5 bg-white text-[10px] font-black text-slate-500 hover:bg-slate-900 hover:text-white rounded-lg uppercase tracking-widest transition-all italic border border-slate-100">
                 Manage TimeTable
              </NavLink>
           </div>
           
           <div className="space-y-4">
              {todayClasses.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-lg">
                    <FiClock size={40} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Zero classes assigned for today.</p>
                </div>
              ) : (
                todayClasses.map((lecture, idx) => (
                  <LiveScheduleItem 
                    key={idx} 
                    lecture={lecture}
                    isLast={idx === todayClasses.length - 1}
                  />
                ))
              )}
           </div>
        </div>

        {/* Right Insights */}
        <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200 group">
                <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10">
                    <div className="p-3 bg-white/10 w-fit rounded-lg mb-6 border border-white/5 backdrop-blur-md">
                        <FiMessageCircle size={24} />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight mb-3">Institutional Inbox</h3>
                    <p className="text-[11px] font-bold opacity-60 uppercase tracking-[0.2em] mb-10 leading-relaxed">Broadcast messages or connect with your students directly through the internal network.</p>
                    <NavLink to="/message" className="block text-center w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-indigo-900/20 italic">
                       Open Interface
                    </NavLink>
                </div>
             </div>

             <div className="bg-white rounded-lg p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center font-black">85%</div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-black">Course Completion</h4>
                </div>
                <div className="relative h-20 flex items-center">
                    <div className="absolute inset-0 bg-white rounded-lg overflow-hidden">
                        <div className="h-full w-[85%] bg-emerald-500 relative group-hover:w-[88%] transition-all duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer"></div>
                        </div>
                    </div>
                    <span className="relative z-10 w-full text-center text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Academic Progress Optimized</span>
                </div>
             </div>
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="pt-12 pb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 opacity-60">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase italic">ITM</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                 Faculty Management Engine v4.0.2 • Synchronized Nodes
              </p>
           </div>
           <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold text-slate-900 uppercase italic cursor-pointer hover:text-indigo-600 transition-colors tracking-widest">Protocol Support</span>
              <span className="text-[10px] font-bold text-slate-900 uppercase italic cursor-pointer hover:text-indigo-600 transition-colors tracking-widest">System Documentation</span>
           </div>
      </footer>
    </div>
  );
};

export default Dashboard;



