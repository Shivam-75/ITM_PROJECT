import React, { memo, useState, useEffect, useCallback } from "react";
import { StudentAcademicService, StudentProfileService } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiPieChart, FiFileText } from "react-icons/fi";

// 🔹 Result Card (performance optimized)
const ResultCard = memo(({ result, studentName }) => {
  const total = result.entries?.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  
  return (
    <div className="bg-white rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50 p-8 group transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic mb-1 flex items-center gap-2">
            <FiFileText /> Official Transcript
          </p>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            {studentName || "Academic Record"}
          </h3>
          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
            {result.course} • SEM {result.semester} • SEC {result.section}
          </p>
        </div>

        <span
          className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${
            total > 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}>
          {total > 0 ? "PUBLISHED" : "PENDING"}
        </span>
      </div>

      <div className="space-y-3 mb-8">
        {result.entries?.map((s, i) => (
             <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-[11px] font-black text-slate-600 uppercase">{s.subject}</span>
                <span className="text-[12px] font-black text-slate-900 italic">{Number(s.marks).toFixed(1)}</span>
             </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Aggregate Pulse</p>
            <p className="text-2xl font-black text-indigo-900 italic tracking-tighter">{total?.toFixed(1)}</p>
          </div>
         <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-slate-300 border border-slate-50">
            <FiPieChart size={20} />
         </div>
      </div>
    </div>
  );
});

// 🔹 Main Component
const Result = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchResults = useCallback(async (sid = "") => {
    try {
      setLoading(true);
      if (!sid) return;
      // Fetch results for the specific student ID
      const { data } = await StudentAcademicService.getResults(sid);
      if (data?.result) {
        setResults(data.result);
      } else if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Result fetch failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
       try {
          const profile = await StudentProfileService.getUserData();
          const student = profile.userData || profile.data?.StudentData;
          setStudentInfo(student);
          if (student?.studentId) {
             fetchResults(student.studentId);
          }
       } catch (err) {
          console.error("Profile initialization failed", err);
       }
    }
    init();
  }, [fetchResults]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-12 h-1 bg-black rounded-full"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Official Records</p>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tight uppercase italic">Transcript Portal.</h2>
            <p className="text-xs text-gray-500 font-medium max-w-sm leading-relaxed uppercase tracking-widest opacity-80">Access your official sessional performance logs and academic analytics.</p>
        </div>
      </div>

      <div className="px-4">
        {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {results.map((result) => (
                <ResultCard key={result._id || result.id} result={result} studentName={studentInfo?.name} />
            ))}
            </div>
        ) : (
            <div className="py-32 text-center bg-gray-50 rounded-[10px] border border-slate-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-[10px] flex items-center justify-center mb-8 shadow-sm border border-slate-100 text-slate-200">
                    <FiFileText size={32} />
                </div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] italic mb-2">No records indexed for this ID</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Sync: Active</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Result;
