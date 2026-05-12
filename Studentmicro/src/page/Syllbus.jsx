import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { WorkAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiDownload, FiFileText, FiBookOpen, FiSearch, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const SyllabusCard = memo(({ item }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className="relative z-10">
        <div className="w-16 h-16 bg-black text-white rounded-[1.25rem] flex items-center justify-center shadow-2xl group-hover:-rotate-6 transition-transform mb-10">
           <FiBookOpen size={28} />
        </div>

        <div className="space-y-3">
            <h3 className="text-2xl font-black text-black tracking-tight leading-tight uppercase group-hover:text-black/70 transition-colors">
                {item.title || "Academic Syllabus"}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] border-b border-gray-50 pb-6 mb-10">Updated {new Date(item.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="mt-8 space-y-4">
             <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <FiCheckCircle className="text-emerald-500" size={20} />
                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Standard University Curriculum</span>
             </div>
        </div>
      </div>

      <div className="mt-12 relative z-10">
        {item.fileUrl && (
          <a 
            href={`http://localhost:5002${item.fileUrl}`} 
            target="_blank" 
            rel="noreferrer" 
            className="w-full flex items-center justify-center gap-3 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            <FiDownload size={18} />
            Acquire PDF
          </a>
        )}
      </div>
    </div>
  );
});

const Syllabus = () => {
  const [syllabusList, setSyllabusList] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSyllabus = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      const student = profileRes.data?.StudentData;
      setStudentInfo(student);

      if (student) {
          const { data } = await WorkAPI.get("/Syllabus/getSyllabus");
          if (Array.isArray(data?.data)) {
            setSyllabusList(data.data);
          }
      }
    } catch (error) {
      console.error("Failed to fetch syllabus", error);
      setSyllabusList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSyllabus();
  }, [fetchSyllabus]);

  const filteredList = useMemo(() => {
    return syllabusList.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [syllabusList, searchTerm]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Hero Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 px-6">
        <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-1 bg-black rounded-full"></div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Curriculum</p>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none">
              Academic <br /> <span className="text-gray-200">Syllabus.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4">
                 <span className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-black shadow-xl shadow-gray-200">
                    {studentInfo?.course || "Course"} Verified
                 </span>
                 <span className="px-6 py-2 bg-white text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-gray-100 shadow-sm">
                    Year {studentInfo?.year || "1"} 
                 </span>
            </div>
        </div>

      </div>

      {filteredList.length === 0 && !loading ? (
        <div className="py-40 text-center bg-gray-50 rounded-[4rem] border border-gray-100 mx-6 flex flex-col items-center">
            <FiBookOpen size={64} className="text-gray-200 mb-8" />
            <p className="text-xs font-black text-gray-300 uppercase tracking-[0.6em]">No Curriculum Resources Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          {filteredList.map((item, index) => (
            <SyllabusCard key={item._id || index} item={item} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-20 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-gray-100 px-6 opacity-60">
           <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200"></div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Documents Verified by ITM Academic Council</p>
           </div>
           <button className="text-[11px] font-black text-black uppercase tracking-[0.3em] hover:underline underline-offset-8 transition-all">Request Updated PDF</button>
      </div>
    </div>
  );
};

export default Syllabus;
