import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../../../store/FacultyStore";
import { WorkAPI } from "../../api/apis";
import { FiMonitor, FiLink, FiLayers, FiCalendar, FiBookOpen } from "react-icons/fi";

export default function LectureForm({ onSuccess, refreshList }) {
  const { toststyle } = useAuth();
  const [uploaderLoading, setuploaderLink] = useState(false);

  const [link, setLink] = useState({
    topic: "",
    linkas: "",
    department: "",
    semester: "",
    section: "",
  });

  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, sRes, secRes] = await Promise.all([
          axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/sections", { withCredentials: true })
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (sRes.data.semesters) setSemesters(sRes.data.semesters);
        if (secRes.data.sections) setSections(secRes.data.sections);
      } catch (err) {
        console.error("Teacher Lecture Registry Sync Failed:", err);
      }
    };
    fetchRegistries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLink((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setuploaderLink(true);

      const { data } = await WorkAPI.post(
        "/Link/Uploader",
        link,
        { withCredentials: true }
      );

      toast.success(data?.message || "Session Link Published", toststyle);
      setLink({ topic: "", linkas: "", department: "", semester: "", section: "" });
      refreshList?.();
      onSuccess?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message, toststyle);
    } finally {
      setuploaderLink(false);
    }
  }, [link, toststyle, refreshList, onSuccess]);

  return (
    <div className="bg-white rounded-lg md:rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10 group overflow-hidden relative">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Session Topic / Curriculum Point</label>
                  <div className="relative group/input">
                      <FiMonitor className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
                      <input 
                        name="topic" 
                        value={link.topic} 
                        onChange={handleChange} 
                        placeholder="E.G. ADVANCED DATA STRUCTURES - MODULE 4" 
                        className="w-full pl-14 pr-5 py-3.5 bg-white border-none rounded-lg text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 transition-all shadow-inner" 
                        required 
                      />
                  </div>
              </div>
              
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Department</label>
                  <div className="relative">
                      <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <select name="department" value={link.department} onChange={handleChange} className="w-full pl-14 pr-4 py-3 bg-white border-none rounded-lg text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-indigo-900 transition-all cursor-pointer" required>
                          <option value="">Select Path</option>
                          {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                      </select>
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Semester</label>
                  <div className="relative">
                      <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <select name="semester" value={link.semester} onChange={handleChange} className="w-full pl-14 pr-4 py-3 bg-white border-none rounded-lg text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-indigo-900 transition-all cursor-pointer" required>
                          <option value="">Select Stage</option>
                          {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                      </select>
                  </div>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Section</label>
                  <div className="relative">
                      <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                      <select name="section" value={link.section} onChange={handleChange} className="w-full pl-14 pr-4 py-3 bg-white border-none rounded-lg text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-indigo-900 transition-all cursor-pointer" required>
                          <option value="">Select Group</option>
                          {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                      </select>
                  </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Digital Access Link</label>
                  <div className="relative group/input">
                      <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors" />
                      <input 
                        name="linkas" 
                        value={link.linkas} 
                        onChange={handleChange} 
                        type="url"
                        placeholder="HTTPS://YOUTUBE.COM/LIVE/..." 
                        className="w-full pl-14 pr-5 py-3 bg-white border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 transition-all shadow-inner" 
                        required 
                      />
                  </div>
              </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
              <button 
                  type="submit" 
                  disabled={uploaderLoading} 
                  className="px-12 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 w-full md:w-fit"
              >
                  <FiMonitor size={14} />
                  {uploaderLoading ? "Broadcasting..." : "Publish Session"}
              </button>
          </div>
      </form>
    </div>
  );
}


