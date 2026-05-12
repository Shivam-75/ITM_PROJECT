import React, { memo, useState, useEffect, useCallback } from "react";
import { ReportAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiPieChart, FiSearch, FiFileText } from "react-icons/fi";

// 🔹 Result Card (performance optimized)
const ResultCard = memo(({ result }) => {
  const total = result.subjects?.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  const isPass = result.subjects?.every(s => Number(s.marks) >= 4);

  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 p-8 group transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic mb-1 flex items-center gap-2">
            <FiFileText /> Official Transcript
          </p>
          <h3 className="text-2xl font-[900] text-slate-900 uppercase tracking-tighter italic leading-none">
            {result.name}
          </h3>
          <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
            {result.course} • SEM {result.semester}
          </p>
        </div>

        <span
          className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${
            isPass ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}>
          {isPass ? "PASS" : "ABSENT/FAIL"}
        </span>
      </div>

      <div className="space-y-3 mb-8">
        {result.subjects?.map((s, i) => (
             <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-[11px] font-black text-slate-600 uppercase">{s.subName}</span>
                <span className="text-[12px] font-black text-slate-900 italic">{Number(s.marks).toFixed(1)}</span>
             </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
         <div className="space-y-0.5">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Aggregate Pulse</p>
            <p className="text-3xl font-black text-indigo-900 italic tracking-tighter">{total?.toFixed(1)}</p>
         </div>
         <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-300">
            <FiPieChart size={20} />
         </div>
      </div>
    </div>
  );
});

// 🔹 Main Component
const Result = () => {
  const [studentId, setStudentId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchResults = useCallback(async (roll = "") => {
    try {
      setLoading(true);
      const { data } = await ReportAPI.get("/Mark/uploade");
      console.log(data)
      if (data?.data) {
        if (roll) {
           setResults(data.data.filter(m => String(m.rollNo).toLowerCase() === roll.toLowerCase()));
        } else {
           setResults(data.data);
        }
      }
    } catch (err) {
      console.error("Result fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
       try {
          const profile = await authAPI.get("/userProfile");
          setStudentInfo(profile.data?.StudentData);
          // Auto-fetch if profile has roll (though student doc might use _id differently)
       } catch (err) {}
    }
    init();
    fetchResults();
  }, [fetchResults]);

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Transcript Portal</h2>
            <p className="text-sm font-medium text-slate-500">Access your official sessional performance logs.</p>
        </div>

      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {results.map((result) => (
            <ResultCard key={result._id || result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-lg border border-slate-50 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-6 text-slate-200">
                <FiFileText size={32} />
            </div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] italic mb-2">No records indexed for this ID</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Sync: Active</p>
        </div>
      )}
    </div>
  );
};

export default Result;



