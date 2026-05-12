import React, { memo, useMemo, useState, useEffect, useCallback } from "react";
import { ReportAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { 
  FiCheckCircle, FiXCircle, FiActivity, FiPieChart, 
  FiCalendar, FiFilter, FiRefreshCw 
} from "react-icons/fi";

const AttendanceRow = memo(({ item }) => {
  const isPresent = item.status?.toLowerCase() === "present";

  return (
    <div className="flex justify-between items-center p-4 md:p-5 bg-white rounded-[10px] border border-slate-50 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[10px] flex items-center justify-center transition-colors ${
            isPresent ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
        }`}>
            {isPresent ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
        </div>
        <div>
          <p className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight italic">{item.subject}</p>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 mt-0.5 uppercase tracking-widest leading-none">
             {new Date(item.date).toDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
          <span
            className={`px-3 md:px-5 py-1.5 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full ring-4 ring-white shadow-sm ${
              isPresent ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}>
            {item.status}
          </span>
      </div>
    </div>
  );
});

const Attendence = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Set default state to Today's date in YYYY-MM-DD format
  const getTodayStr = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      const student = profileRes.data?.StudentData;
      setStudentInfo(student);

      if (student) {
          const { data } = await ReportAPI.get(`/Attendance/Show?section=${student.section}&semester=${student.semester}`);
          if (Array.isArray(data?.data)) {
            setAttendanceData(data.data);
          }
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const filteredData = useMemo(() => {
    if (!selectedDate) return attendanceData;
    return attendanceData.filter(item => item.date === selectedDate);
  }, [attendanceData, selectedDate]);

  const totalClasses = attendanceData.length;
  const presentCount = attendanceData.filter((item) => item.status?.toLowerCase() === "present").length;
  const absentCount = totalClasses - presentCount;
  const attendancePercentage = totalClasses ? Math.round((presentCount / totalClasses) * 100) : 0;

  return (
    <div className="min-h-screen space-y-6 md:space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic uppercase">Daily Attendance</h2>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                {studentInfo?.course || "STUDENT"} • SEM {studentInfo?.semester || "1"} • {studentInfo?.section || "A1"}
            </p>
        </div>
        
        {/* Date Filter Widget */}
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border border-slate-100 rounded-[10px] shadow-sm text-xs font-black uppercase text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all cursor-pointer"
                />
            </div>
            {selectedDate && (
                <button 
                    onClick={() => setSelectedDate("")}
                    className="p-3.5 bg-white text-slate-500 rounded-[10px] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                    <FiRefreshCw size={18} />
                </button>
            )}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
        <div className="bg-emerald-500 rounded-[10px] p-6 md:p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
          <FiCheckCircle size={100} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform rotate-12" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Present</p>
          <div className="flex items-baseline gap-1">
              <h3 className="text-3xl md:text-4xl font-black">{presentCount}</h3>
              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">sessions</span>
          </div>
        </div>

        <div className="bg-rose-500 rounded-[10px] p-6 md:p-8 text-white shadow-xl shadow-rose-100 relative overflow-hidden group">
          <FiXCircle size={100} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform -rotate-12" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Absent</p>
          <div className="flex items-baseline gap-1">
              <h3 className="text-3xl md:text-4xl font-black">{absentCount}</h3>
              <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">sessions</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[10px] p-6 md:p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
          <FiPieChart size={100} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Attendance Rate</p>
          <div className="flex items-baseline gap-1">
              <h3 className={`text-3xl md:text-4xl font-black ${attendancePercentage >= 75 ? "text-emerald-400" : "text-rose-400"}`}>
                {attendancePercentage}%
              </h3>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-6 px-4 md:px-0">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-indigo-600">
              <FiFilter size={14} />
           </div>
           <h3 className="text-sm md:text-lg font-black text-slate-800 tracking-tight italic uppercase">
              {selectedDate === getTodayStr() ? "Today's Academic Sessions" : (selectedDate ? `Logs for ${new Date(selectedDate).toDateString()}` : "Full History Log")}
           </h3>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center">
             <div className="w-16 h-16 bg-white rounded-[10px] flex items-center justify-center mb-4">
                <FiActivity size={24} className="text-slate-200" />
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">No sessions found for this day</p>
             <button onClick={() => setSelectedDate("")} className="mt-4 text-[10px] font-black text-indigo-600 uppercase underline underline-offset-4 tracking-widest">View Complete History</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {filteredData.map((item, index) => (
              <AttendanceRow key={index} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendence;



