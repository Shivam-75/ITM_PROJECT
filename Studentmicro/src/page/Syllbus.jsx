import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { WorkAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiDownload, FiFileText, FiBookOpen, FiExternalLink, FiSearch } from "react-icons/fi";

const SyllabusCard = memo(({ item }) => {
  return (
    <div className="bg-white rounded-lg p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full">
      {/* Abstract Background element */}
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-indigo-50 rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-6 group-hover:rotate-6 transition-transform">
           <FiFileText size={28} />
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase italic group-hover:text-indigo-600 transition-colors">
                {item.title || "Academic Syllabus"}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Updated {new Date(item.updatedAt || Date.now()).toLocaleDateString()}</p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
             <div className="flex items-center gap-3 text-xs font-bold text-slate-500 italic">
                <FiBookOpen className="text-indigo-600" />
                <span>Standard University Curriculum</span>
             </div>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        {item.fileUrl && (
          <a 
            href={item.fileUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <FiDownload size={16} />
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
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 md:px-0">
        <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
              Academic <span className="text-indigo-600">Syllabus</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3">
                 <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 italic">
                    {studentInfo?.course || "Course"} Curriculum
                 </span>
                 <span className="px-4 py-1.5 bg-white text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full italic">
                    Year {studentInfo?.year || "1"} 
                 </span>
            </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 group">
             <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
             <input 
                type="text"
                placeholder="Find Subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-lg shadow-sm text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all"
             />
        </div>
      </div>

      {filteredList.length === 0 && !loading ? (
        <div className="py-24 text-center bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center mx-4 md:mx-0">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-6">
             <FiBookOpen size={32} className="text-slate-200" />
          </div>
          <p className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">No Curriculum Resources Found</p>
          <button onClick={() => setSearchTerm("")} className="mt-6 text-[10px] font-black text-indigo-600 uppercase underline underline-offset-4 tracking-widest">Clear Search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
          {filteredList.map((item, index) => (
            <SyllabusCard key={item._id || index} item={item} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 opacity-60 px-4 md:px-0">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">All Documents Verified by ITM Academic Council</p>
           </div>
           <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Request Updated PDF</button>
      </div>
    </div>
  );
};

export default Syllabus;



