import React, { memo, useState, useEffect, useCallback } from "react";
import { ReportAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiCalendar, FiClock, FiMapPin, FiLayers, FiFileText } from "react-icons/fi";

const ExamCard = memo(({ exam }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 p-8 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <FiFileText size={120} />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center gap-2">
            <FiLayers /> SESSIONAL CYCLE {exam.ct}
          </p>
          <h3 className="text-2xl font-[900] text-slate-900 uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors">
            {exam.Subject}
          </h3>
          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
            Protocol: {exam.ExamType}
          </p>
        </div>

        <div className="bg-slate-900 text-white w-12 h-12 rounded-lg flex flex-col items-center justify-center shadow-lg shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
            <span className="text-[10px] font-black leading-none">CT</span>
            <span className="text-lg font-black leading-none">{exam.ct}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <FiCalendar size={18} />
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Exam Date</p>
                <p className="text-[11px] font-black text-slate-700 uppercase italic">{exam.Date}</p>
            </div>
         </div>

         <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <FiClock size={18} />
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Time Slot</p>
                <p className="text-[11px] font-black text-slate-700 uppercase italic whitespace-nowrap">{exam.time}</p>
            </div>
         </div>

         <div className="flex items-center gap-3 col-span-2 mt-2 pt-4 border-t border-slate-50">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <FiMapPin size={18} />
            </div>
            <div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Location / Room</p>
                <p className="text-[11px] font-black text-slate-700 uppercase italic">{exam.RoomNo || exam.room}</p>
            </div>
         </div>
      </div>
    </div>
  );
});

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchExams = useCallback(async (course, semester) => {
    try {
      setLoading(true);
      const { data } = await ReportAPI.get("/Exam-Schedule/uploader");
      if (data?.data && course && semester) {
        const filtered = data.data.filter(e => 
          e.Department.toLowerCase() === course.toLowerCase() && 
          String(e.Semester).toLowerCase() === String(semester).toLowerCase()
        );
        setExams(filtered);
      } else {
        setExams(data?.data || []);
      }
    } catch (err) {
      console.error("Exam fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
       try {
          const profile = await authAPI.get("/userProfile");
          const student = profile.data?.StudentData;
          setStudentInfo(student);
          fetchExams(student?.course, student?.semester);
       } catch (err) {
          fetchExams();
       }
    }
    init();
  }, [fetchExams]);

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Sessional Master Registry</h2>
          <p className="text-sm font-medium text-slate-500">Official examination slotting for {studentInfo?.course || "ITM"} • {studentInfo?.semester || "N/A"}</p>
      </div>

      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {exams.map((exam) => (
            <ExamCard key={exam._id || exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        !loading && (
            <div className="py-32 text-center bg-white rounded-lg border border-slate-50 shadow-sm flex flex-col items-center">
                <div className="w-16 h-1 bg-white rounded-full mb-6"></div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] italic mb-2">No schedules released for your session</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Frequency: Real-time</p>
            </div>
        )
      )}
    </div>
  );
};

export default ExamSchedule;



