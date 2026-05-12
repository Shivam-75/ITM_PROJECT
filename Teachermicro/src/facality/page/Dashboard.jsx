import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { authAPI, ReportAPI, WorkAPI } from "../api/apis";
import { 
  FiUsers, FiBookOpen, FiClock, FiCheckSquare, 
  FiCalendar, FiMessageCircle, FiTrendingUp, FiArrowRight, FiShield, FiZap, FiActivity
} from "react-icons/fi";
import Loader from "../common/Loader";
import { NavLink } from "react-router-dom";

const StatCard = memo(({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-14 h-14 rounded-[10px] flex items-center justify-center text-white shadow-xl ${colorClass} group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={26} />
      </div>
      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-[10px] uppercase tracking-widest">{trend || "+0%"}</span>
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{value}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 italic">{title}</p>
    </div>
  </div>
));

const LiveScheduleItem = ({ lecture, isLast }) => {
  // Logic to determine if a lecture is "Ongoing" or "Upcoming" (Dummy for now)
  const isOngoing = lecture.time.toLowerCase().includes("10:30") || lecture.time.toLowerCase().includes("am"); // Placeholder logic

  return (
    <div className={`relative flex gap-6 p-6 transition-all duration-300 group hover:bg-white/80 rounded-[10px] ${!isLast ? 'mb-2' : ''}`}>
      {/* Time Column */}
      <div className="flex flex-col items-center min-w-[80px]">
         <span className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter">{lecture.time.split('-')[0]}</span>
         <div className={`w-0.5 h-full my-2 bg-gradient-to-b ${isLast ? 'from-slate-100 to-transparent' : 'from-slate-100 via-slate-200 to-slate-100'} group-hover:via-indigo-200`}></div>
      </div>

      {/* Content Card */}
      <div className="flex-1 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
               <h4 className="text-base font-black text-slate-900 uppercase italic tracking-tight group-hover:text-black transition-colors">
                  {lecture.subject}
               </h4>
               {isOngoing && (
                 <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">
                   <FiZap size={8} /> Live Now
                 </span>
               )}
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-slate-500 rounded-[10px] group-hover:bg-white transition-colors border border-slate-100 group-hover:border-slate-100">
                  <FiUsers size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{lecture.info}</span>
               </div>
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-100 text-indigo-600 rounded-[10px] group-hover:bg-white transition-colors border border-slate-100 group-hover:border-slate-100">
                  <FiClock size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{lecture.time}</span>
               </div>
            </div>
         </div>

         <button className="w-10 h-10 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-slate-100 group-hover:shadow-lg group-hover:shadow-indigo-50 transition-all active:scale-90">
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
    onlineClasses: 0,
    timeTable: []
  });
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      setProfile(profileRes.data?.userData);

      const [studentsRes, hwRes, assRes, ttRes, linkRes] = await Promise.all([
        authAPI.get("/StudentList"),
        WorkAPI.get("/Homework/uploader"),
        WorkAPI.get("/Assignment/uploader"),
        ReportAPI.get("/TimeTable/uploader"),
        WorkAPI.get("/Link/Uploader")
      ]);

      setStats({
        students: studentsRes.data?.studentList?.length || 0,
        homework: hwRes.data?.HomeworkData?.length || 0,
        assignments: assRes.data?.AssignmnetData?.length || 0,
        onlineClasses: linkRes.data?.findUserLinks?.length || 0,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-[10px] text-slate-900 border border-slate-100 shadow-sm relative overflow-hidden shadow-2xl shadow-slate-100/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
             <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full italic">Pedagogical Engine</span>
             <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                <FiShield size={10} /> Authenticated Access
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Welcome, {profile?.name?.split(' ')[0] || "Professor"}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed max-w-xl">
            You are currently managing the <span className="text-black font-black">{profile?.department?.join(", ") || "Academic"}</span> tools below.
          </p>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-[10px] shadow-xl text-[10px] font-black text-black uppercase tracking-[0.3em] italic group hover:bg-black hover:text-white transition-all cursor-default relative z-10">
           <FiCalendar className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all" />
           {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Students" value={stats.students} icon={FiUsers} colorClass="bg-indigo-600" trend="+4%" />
        <StatCard title="Assignments" value={stats.assignments} icon={FiCheckSquare} colorClass="bg-rose-600" trend="+2%" />
        <StatCard title="Homework Sets" value={stats.homework} icon={FiBookOpen} colorClass="bg-slate-900" />
        <StatCard title="Virtual Hub" value={stats.onlineClasses} icon={FiActivity} colorClass="bg-blue-600" />
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PREMIUM LIVE SCHEDULE TIMELINE */}
        <div className="lg:col-span-8 bg-white rounded-[10px] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
           <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                     <FiTrendingUp className="text-black" />
                     Live Academic Schedule
                  </h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Tracking your current day lecture capacity</p>
              </div>
              <NavLink to="/timetable" className="px-5 py-2.5 bg-white text-[10px] font-black text-slate-500 hover:bg-slate-900 hover:text-white rounded-[10px] uppercase tracking-widest transition-all italic border border-slate-100">
                 Manage TimeTable
              </NavLink>
           </div>
           
           <div className="space-y-4">
              {todayClasses.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-[10px]">
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

             <div className="bg-white rounded-[10px] p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[10px] flex items-center justify-center font-black">85%</div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Course Completion</h4>
                </div>
                <div className="relative h-20 flex items-center">
                    <div className="absolute inset-0 bg-white rounded-[10px] overflow-hidden">
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



