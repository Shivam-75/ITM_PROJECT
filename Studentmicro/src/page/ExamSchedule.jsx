import React, { memo, useState, useEffect, useCallback } from "react";
import { StudentAcademicService, StudentProfileService } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiCalendar, FiClock, FiMapPin, FiLayers, FiFileText } from "react-icons/fi";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchExams = useCallback(async (isInitial = false) => {
    try {
      if (isInitial || exams.length === 0) setLoading(true);
      const res = await StudentAcademicService.getExams();
      const data = res.data || res;
      if (data?.data) {
        setExams(data.data);
      } else if (Array.isArray(data)) {
        setExams(data);
      }
    } catch (err) {
      console.error("Exam fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [exams.length]);

  useEffect(() => {
    const init = async () => {
       try {
          const profile = await StudentProfileService.getUserData();
          const student = profile.userData || profile.data?.StudentData;
          setStudentInfo(student);
          fetchExams(true);
       } catch (err) {
          fetchExams(true);
       }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div className="px-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Sessional Master Registry</h2>
          <div className="flex items-center gap-3 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official examination slotting for {studentInfo?.course || "ITM"} • {studentInfo?.semester || "N/A"}</p>
          </div>
      </div>

      <div className="px-6">
          <div className="bg-white rounded-[10px] border border-slate-100 shadow-2xl shadow-indigo-100/20 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                      <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cycle</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject Title</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Protocol</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time Slot</th>
                              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {exams.length > 0 ? (
                              exams.map((exam) => (
                                  <tr key={exam._id || exam.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                      <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-lg">
                                                  <span className="text-[8px] font-black leading-none uppercase">CT</span>
                                                  <span className="text-sm font-black leading-none">{exam.ct}</span>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-8 py-6">
                                          <div>
                                              <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{exam.Subject}</p>
                                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Core</p>
                                          </div>
                                      </td>
                                      <td className="px-8 py-6">
                                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                              {exam.ExamType}
                                          </span>
                                      </td>
                                      <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                              <FiCalendar className="text-slate-300" size={14} />
                                              <span className="text-[10px] font-black text-slate-700 uppercase italic">{exam.Date}</span>
                                          </div>
                                      </td>
                                      <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                              <FiClock className="text-slate-300" size={14} />
                                              <span className="text-[10px] font-black text-slate-700 uppercase italic">{exam.time}</span>
                                          </div>
                                      </td>
                                      <td className="px-8 py-6 text-right">
                                          <div className="inline-flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                                              <FiMapPin className="text-indigo-600" size={14} />
                                              <span className="text-[10px] font-black text-slate-700 uppercase italic">{exam.RoomNo || exam.room}</span>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan="6" className="py-32 text-center bg-white">
                                      <div className="flex flex-col items-center">
                                          <div className="w-16 h-1 bg-slate-100 rounded-full mb-6"></div>
                                          <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] italic mb-2">No schedules released for your session</h3>
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Frequency: Real-time</p>
                                      </div>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ExamSchedule;



