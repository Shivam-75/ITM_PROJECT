import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { StudentAcademicService, StudentProfileService } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiDownload, FiFileText, FiSearch, FiLayers, FiCheckCircle, FiArrowRight } from "react-icons/fi";

// 🔹 Single Card Component
const PaperCard = memo(({ paper }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
            <div className="w-16 h-16 bg-black text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
               <FiFileText size={28} />
            </div>
            <div className="text-right">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">{paper.duration || "N/A"}</span>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-tight mt-1">Assessment Window</p>
            </div>
        </div>

        <div className="space-y-2">
            <h3 className="text-2xl font-black text-black tracking-tight uppercase leading-tight group-hover:text-black/70 transition-colors">
                {paper.subject}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 border-b border-gray-50 pb-6">Module: {paper.semester}</p>
        </div>

        <div className="mt-8 pt-8 grid grid-cols-2 gap-6">
              <div className="space-y-2 bg-gray-50/50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Max Weightage</p>
                <div className="flex items-center gap-2 text-[11px] font-black text-black">
                    <FiCheckCircle size={14} className="text-emerald-500" />
                    {paper.totalMarks || "100"} Points
                </div>
             </div>
             <div className="space-y-2 bg-gray-50/50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Release Cycle</p>
                <div className="flex items-center gap-2 text-[11px] font-black text-black">
                    <FiLayers size={14} className="text-black" />
                    {paper.year}
                </div>
             </div>
        </div>
      </div>

      <div className="mt-12 relative z-10">
        {paper.paperImage && (
          <a 
            href={`https://itm-project-1-ilmh.onrender.com${paper.paperImage}`} 
            target="_blank" 
            rel="noreferrer" 
            className="w-full flex items-center justify-center gap-3 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            <FiDownload size={18} />
            Acquire Resource
          </a>
        )}
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
      const profileRes = await StudentProfileService.getUserData();
      const student = profileRes.userData || profileRes.data?.StudentData;
      setStudentInfo(student);

      if (student) {
          const res = await StudentAcademicService.getModelPapers();
          const data = res.data || res;
          if (Array.isArray(data)) {
            setPapers(data);
          } else if (Array.isArray(data.data)) {
            setPapers(data.data);
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
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 px-6">
        <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-1.5 bg-black rounded-full"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Inventory</p>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none">
              Model Paper.
            </h2>
            <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-full border border-slate-100 w-fit">
                 <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    {studentInfo?.course || "ITM"} Curriculum Assets
                 </p>
            </div>
        </div>

      </div>

      {filteredList.length === 0 && !loading ? (
        <div className="py-40 text-center bg-gray-50 rounded-[4rem] border border-slate-100 mx-6 flex flex-col items-center">
            <FiFileText size={64} className="text-gray-200 mb-8" />
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-[0.6em]">No Resources Archived</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          {filteredList.map((item) => (
            <PaperCard key={item._id} paper={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelPaper;
