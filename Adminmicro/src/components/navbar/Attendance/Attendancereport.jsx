import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiCalendar,
  FiPrinter,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiDatabase
} from "react-icons/fi";
import { toast } from "react-toastify";

// 🔹 Backend Base URL (Admin Endpoint)
const ADMIN_REPORT_URL = import.meta.env.VITE_BASE_REPORT;

const Attendancereport = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 🔹 Filter States
  const [filters, setFilters] = useState({
    course: "All",
    section: "All",
    semester: "All"
  });

  // Registry States
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const itemsPerPage = 30;

  // 🔹 Fetch Global Attendance & Registries
  const fetchData = async () => {
    try {
      setLoading(true);
      const [attRes, courseRes, secRes, semRes] = await Promise.all([
        axios.get(`${ADMIN_REPORT_URL}/Attendance/All`, { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/sections", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true })
      ]);
      
      if (attRes.data.data) setAttendanceList(attRes.data.data);
      if (courseRes.data.courses) setCourses(courseRes.data.courses);
      if (secRes.data.sections) setSections(secRes.data.sections);
      if (semRes.data.semesters) setSemesters(semRes.data.semesters);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to sync attendance registries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Logic: Multi-Criteria Filtering
  const filteredRecords = useMemo(() => {
    return attendanceList.filter(record => {
      const matchSearch = (record.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchCourse = filters.course === "All" || 
                          (record.course?.toLowerCase() === filters.course.toLowerCase());
      
      const matchSection = filters.section === "All" || 
                           (record.section?.toLowerCase() === filters.section.toLowerCase());
      
      const matchSemester = filters.semester === "All" || 
                            (record.semester?.toString() === filters.semester.toString());

      return matchSearch && matchCourse && matchSection && matchSemester;
    });
  }, [searchTerm, attendanceList, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStats = (records) => {
    if (!records) return { present: 0, total: 0, percentage: 0 };
    const present = records.filter(r => r.status === "Present").length;
    const total = records.length;
    return {
      present,
      total,
      percentage: Math.round((present / total) * 100)
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Attendance <span className="text-red-600">Master Registry</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2 italic">
            <FiDatabase className="text-red-600" />
            Global Institution Monitoring • Central Repository
          </p>
        </div>
        
        <button
          onClick={() => window.print()}
          className="flex items-center gap-3 px-6 py-3 bg-[#111111] text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic hover:bg-black transition-all shadow-lg active:scale-95 border border-white/5"
        >
          <FiPrinter size={16} />
          Print Audit Report
        </button>
      </div>

      {/* Main Registry Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Advanced Filter Toolbar */}
        <div className="p-8 border-b border-gray-50 space-y-6 bg-white/20">
           <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
              {/* Search Box */}
              <div className="relative w-full xl:w-96">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Subject..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wide italic outline-none focus:border-red-600 transition-all shadow-sm"
                  />
              </div>

              {/* Tag Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
                 {/* Course Filter */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic ml-2">Department</label>
                    <select 
                      value={filters.course}
                      onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                      className="bg-white border border-gray-200 p-3 rounded-lg text-[10px] font-black uppercase italic outline-none focus:border-red-600 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="All">All Courses</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>
                      ))}
                    </select>
                 </div>

                 {/* Section Filter */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic ml-2">Section</label>
                    <select 
                      value={filters.section}
                      onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                      className="bg-white border border-gray-200 p-3 rounded-lg text-[10px] font-black uppercase italic outline-none focus:border-red-600 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="All">All Sections</option>
                      {sections.map(s => (
                        <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
                      ))}
                    </select>
                 </div>

                 {/* Semester Filter */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic ml-2">Semester</label>
                    <select 
                      value={filters.semester}
                      onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                      className="bg-white border border-gray-200 p-3 rounded-lg text-[10px] font-black uppercase italic outline-none focus:border-red-600 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="All">All Semesters</option>
                      {semesters.map(s => (
                        <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
                      ))}
                    </select>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="h-0.5 w-6 bg-red-600"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                Registry Matches: <span className="text-gray-900">{filteredRecords.length}</span>
              </p>
           </div>
        </div>

        {/* Live List Body */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
              <p className="text-[9px] font-black uppercase italic tracking-widest text-gray-400">Syncing with Cloud Registry...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 font-sans">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 font-sans">Academic Unit</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 font-sans">Subject / Topic</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 font-sans">Engagement Metrics</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 italic border-b border-gray-100 text-right font-sans">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentRecords.length > 0 ? (
                  currentRecords.map((item, index) => {
                    const stats = getStats(item.records);
                    return (
                      <tr key={index} className="group hover:bg-white/80 transition-all">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                                <FiCalendar size={18} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-900 italic uppercase">
                                  {new Date(item.date).toLocaleDateString()}
                                </p>
                                <p className="text-[8px] font-black text-gray-400 uppercase italic tracking-tighter">Session Verified</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-wrap gap-2">
                              <span className="px-2.5 py-1.5 rounded-lg bg-white text-[#111111] text-[9px] font-black uppercase italic border border-gray-200">
                                DEPT: {item.course}
                              </span>
                              <span className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-[9px] font-black uppercase italic border border-red-100">
                                SEC: {item.section || 'A'}
                              </span>
                              <span className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase italic border border-emerald-100">
                                SEM: {item.semester}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-gray-900 uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
                          {item.subject}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2 w-40">
                             <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-1000 ${stats.percentage > 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                  style={{ width: `${stats.percentage}%` }}
                                ></div>
                             </div>
                             <p className="text-[9px] font-black uppercase tracking-widest italic text-gray-500">
                               Session Presence: <span className="text-gray-900">{stats.percentage}%</span>
                             </p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <span className="text-[9px] font-black uppercase tracking-widest italic text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                             Registry Logged
                           </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-300">
                         <FiFileText size={48} />
                         <p className="text-sm font-black uppercase italic tracking-widest">No Synchronized Records Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="p-8 border-t border-gray-50 bg-white/30 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
              Registry Page {currentPage} of {Math.max(1, totalPages)}
           </p>
           <div className="flex items-center gap-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-3 bg-white border border-gray-200 text-gray-400 rounded-lg shadow-sm disabled:opacity-30 hover:text-red-600 transition-all"><FiChevronLeft size={16} /></button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => paginate(i+1)} className={`w-10 h-10 rounded-lg text-[10px] font-black italic shadow-md transition-all ${currentPage === i+1 ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:bg-white'}`}>{i+1}</button>
              ))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-3 bg-white border border-gray-200 text-gray-400 rounded-lg shadow-sm disabled:opacity-30 hover:text-red-600 transition-all"><FiChevronRight size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Attendancereport;




