import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../store/FacultyStore";
import { toast } from "react-toastify";
import { WorkAPI } from "../../api/apis";
import { FiSend } from "react-icons/fi";
import axios from "axios";

const NoticeForm = ({ onSave, initialData }) => {
  const { toststyle } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    year: "",
  });

  const [noticeLoading, setNoticeLoading] = useState(false);

  // Registry States
  const [courses, setCourses] = useState([]);
  const [yearsList, setYearsList] = useState([]);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, yRes] = await Promise.all([
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-courses", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-years", { withCredentials: true })
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (yRes.data.years) setYearsList(yRes.data.years);
      } catch (err) {
        console.error("Notice Registry Sync Failed:", err);
      }
    };
    fetchRegistries();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (noticeLoading) return;

    setNoticeLoading(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        year: formData.year // Removed Number() casting
      };

      const { data } = await WorkAPI.post("/Notice/uploader", payload, { withCredentials: true });
      toast.success(data?.message || "Notice Published Successfully", toststyle);
      
      setFormData({ title: "", description: "", department: "", year: "" });
      onSave?.(data?.serchNotice);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Notice Upload Failed", toststyle);
    } finally {
      setNoticeLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10 group overflow-hidden relative">
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Announcement Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="E.G. URGENT: SEMESTER EXAM UPDATES" 
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 transition-all shadow-inner" 
                    required 
                  />
              </div>
              
              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-indigo-900 transition-all cursor-pointer" required>
                      <option value="">Select Path</option>
                      {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Target Year</label>
                  <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-indigo-900 transition-all cursor-pointer" required>
                      <option value="">Select Stage</option>
                      {yearsList.map(y => <option key={y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                  </select>
              </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Announcement Details</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="DETAILED PROTOCOL DESCRIPTION..." 
                rows={4}
                className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm resize-none"
                required
              />
          </div>

          <div className="flex justify-end pt-2">
              <button 
                  type="submit" 
                  disabled={noticeLoading} 
                  className="px-12 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 w-fit"
              >
                  <FiSend size={14} />
                  {noticeLoading ? "Transmitting..." : "Publish Notice"}
              </button>
          </div>
      </form>
    </div>
  );
};

export default NoticeForm;