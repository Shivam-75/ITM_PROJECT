import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { StudentAcademicService, StudentProfileService } from "../api/apis";
import Loader from "../components/common/Loader";
import { FiDownload, FiFileText, FiBookOpen, FiSearch, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const Syllabus = () => {
  const [syllabusList, setSyllabusList] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSyllabus = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await StudentProfileService.getUserData();
      const student = profileRes.userData || profileRes.data?.StudentData;
      setStudentInfo(student);

      if (student) {
          const subRes = await StudentAcademicService.getSubjects({
              department: student.course,
              semester: student.semester
          });
          const data = subRes.data || subRes;
          
          if (Array.isArray(data?.subjects)) {
            setSyllabusList(data.subjects);
          } else {
            const generalSyllabus = await StudentAcademicService.getSyllabus();
            const sylData = generalSyllabus.data || generalSyllabus;
            if (Array.isArray(sylData?.data)) {
                setSyllabusList(sylData.data);
            } else if (Array.isArray(sylData)) {
                setSyllabusList(sylData);
            }
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
    return syllabusList.filter(item => {
      const searchTitle = (item.name || item.title || "").toLowerCase();
      return searchTitle.includes(searchTerm.toLowerCase());
    });
  }, [syllabusList, searchTerm]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
            <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter leading-none">
              Academic <br /> <span className="text-gray-200 text-lg md:text-xl">Syllabus.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-4">
                 <span className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-black shadow-xl shadow-gray-200">
                    {studentInfo?.course || "Course"} Verified
                 </span>
                 <span className="px-6 py-2 bg-white text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-100 shadow-sm">
                    {studentInfo?.semester || "Semester"} 
                 </span>
            </div>
        </div>

        <div className="relative w-full lg:w-96">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="SEARCH CURRICULUM..."
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-gray-50 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="px-6">
          <div className="bg-white rounded-[10px] border border-slate-100 shadow-2xl shadow-gray-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                      <thead>
                          <tr className="bg-gray-50/50 border-b border-slate-50">
                              <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Subject Protocol</th>
                              <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Identification</th>
                              <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Academic Unit</th>
                              <th className="px-8 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Semester</th>
                              <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Resource</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {filteredList.length > 0 ? (
                              filteredList.map((item, index) => (
                                  <tr key={item._id || index} className="group hover:bg-gray-50/30 transition-all duration-500">
                                      <td className="px-10 py-8">
                                          <div className="flex items-center gap-5">
                                              <div className="w-12 h-12 bg-black rounded-[10px] flex items-center justify-center text-white shadow-lg group-hover:-rotate-6 transition-transform">
                                                  <FiBookOpen size={20} />
                                              </div>
                                              <div>
                                                  <p className="text-[11px] font-black text-black uppercase tracking-tight italic leading-none">{item.name || item.title || "Academic Syllabus"}</p>
                                                  <p className="text-[8px] font-bold text-gray-400 uppercase mt-1.5 flex items-center gap-2">
                                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                      Verified Curriculum
                                                  </p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-8 py-8">
                                          <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                              {item.code || "NOT-CODED"}
                                          </span>
                                      </td>
                                      <td className="px-8 py-8 text-[10px] font-black text-black uppercase italic tracking-tighter">
                                          {item.department || studentInfo?.course || "N/A"}
                                      </td>
                                      <td className="px-8 py-8 text-[10px] font-black text-gray-500 uppercase italic tracking-tighter">
                                          {item.semester || studentInfo?.semester || "N/A"}
                                      </td>
                                      <td className="px-10 py-8 text-right">
                                          {(item.fileUrl || item.syllabusUrl) ? (
                                              <a 
                                                  href={item.fileUrl ? `https://itm-project-1-ilmh.onrender.com${item.fileUrl}` : item.syllabusUrl} 
                                                  target="_blank" 
                                                  rel="noreferrer" 
                                                  className="inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
                                              >
                                                  <FiDownload size={14} />
                                                  ACQUIRE PDF
                                              </a>
                                          ) : (
                                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">No PDF Linked</span>
                                          )}
                                      </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan="5" className="py-40 text-center">
                                      <div className="flex flex-col items-center justify-center gap-6">
                                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                              <FiFileText size={40} />
                                          </div>
                                          <p className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] italic">No curriculum resources archived</p>
                                      </div>
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* Footer Info */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-slate-100 px-6 opacity-60">
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
