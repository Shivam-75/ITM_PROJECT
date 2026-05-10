import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { WorkAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiDownload, FiFileText, FiBookOpen, FiClock, FiSearch, FiLayers, FiCheckCircle } from "react-icons/fi";

// 🔹 Single Card Component
const PaperCard = memo(({ paper }) => {
  return (
    <div className="bg-white rounded-lg p-8 border border-slate-100 shadow-xl shadow-slate-50/50 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
               <FiFileText size={28} />
            </div>
            <div className="text-right">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">{paper.duration}</span>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight italic">Estimated Timing</p>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none group-hover:text-indigo-600 transition-colors">
                {paper.subject}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module: {paper.semester}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Max Weightage</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 italic">
                    <FiCheckCircle size={12} className="text-emerald-500" />
                    {paper.totalMarks} Score
                </div>
             </div>
             <div className="space-y-1 border-l border-slate-100 pl-4">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Release Cycle</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 italic">
                    <FiLayers size={12} className="text-indigo-600" />
                    {paper.year}
                </div>
             </div>
        </div>
      </div>

      <div className="mt-10 relative z-10">
        <a 
          href={paper.fileUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 italic"
        >
          <FiDownload size={16} />
          Acquire Assessment
        </a>
      </div>
    </div>
  );
});

// 🔹 Main Component
const ModelPaper = () => {
  const [papers, setPapers] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      const student = profileRes.data?.StudentData;
      setStudentInfo(student);

      if (student) {
          const { data } = await WorkAPI.get("/ModelPaper/all");
          if (data?.success && Array.isArray(data.data)) {
            // Client side filtering for extra safety
            setPapers(data.data.filter(p => 
                p.course.toLowerCase() === student.course.toLowerCase()
            ));
          }
      }
    } catch (error) {
      console.error("Failed to fetch model papers", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const filteredList = useMemo(() => {
    return papers.filter(item => 
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [papers, searchTerm]);

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter uppercase italic leading-[0.85]">
              Assessment <span className="text-indigo-600">Inventory</span>
            </h2>
            <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                    {studentInfo?.course || "ITM"} • Verified Study Assets
                 </p>
            </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 group">
             <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
                type="text"
                placeholder="Find Subject / Paper..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-lg shadow-xl shadow-slate-100/30 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all italic"
             />
        </div>
      </div>

      {filteredList.length === 0 && !loading ? (
        <div className="py-32 text-center bg-white rounded-lg border border-slate-50 shadow-2xl shadow-slate-200/20 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-10 group hover:rotate-12 transition-transform">
                <FiFileText size={48} className="text-slate-100" />
            </div>
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.6em] italic">No Resources Archived Yet</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{studentInfo?.course} Registry Status: Operational</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredList.map((item) => (
            <PaperCard key={item._id} paper={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelPaper;



