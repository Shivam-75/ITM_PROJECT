import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiEdit2,
  FiBookOpen
} from "react-icons/fi";
import useAuth from "../store/AdminStore";
import Loader from "../components/Loader";

const Settings = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Course Management States
  const [fileCourses, setFileCourses] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [courseForm, setCourseForm] = useState({
    name: "",
    department: "",
    deptCode: "",
    hod: "",
    duration: "",
    description: "",
    status: "Active"
  });

  const [editId, setEditId] = useState(null);

  // Fetch courses and years
  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, yearRes] = await Promise.all([
        axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic/years", { withCredentials: true })
      ]);
      
      if (courseRes.data.data) setFileCourses(courseRes.data.data);
      if (yearRes.data.data) setYearsList(yearRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add or Update Course
  const handleExecute = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.department || !courseForm.duration) {
      return toast.error("Essential Fields are Mandatory", toststyle);
    }
    
    try {
      setLoading(true);
      if (editId) {
        await axios.delete(`https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic/courses/${editId}`, { withCredentials: true });
      }
      const res = await axios.post("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic/courses", courseForm, { withCredentials: true });
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setCourseForm({ name: "", department: "", deptCode: "", hod: "", duration: "", description: "", status: "Active" });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error", toststyle);
    } finally {
      setLoading(false);
    }
  };

  // Edit Trigger
  const triggerEdit = (course) => {
    setCourseForm({
      name: course.name,
      department: course.department,
      deptCode: course.deptCode || "",
      hod: course.hod || "",
      duration: course.duration,
      description: course.description || "",
      status: course.status || "Active"
    });
    setEditId(course._id || course.id);
  };

  // Delete Course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Purge this course from registry?")) return;
    try {
      setLoading(true);
      await axios.delete(`https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic/courses/${id}`, { withCredentials: true });
      toast.success("Course Purged", toststyle);
      setFileCourses(prev => prev.filter(c => (c._id || c.id) !== id));
    } catch (err) {
      toast.error("Purge Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 p-2 md:p-6 lg:p-10">
      {loading && <Loader />}

      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* 📋 Form Section */}
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden w-[98%] mx-auto md:w-full">
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-white border border-slate-100 text-blue-600 rounded-lg">
                <FiBookOpen size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Course Details" : "Course Management"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Course Name</label>
                <input type="text" placeholder="e.g. B.Tech Computer Science" value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Department</label>
                <input type="text" placeholder="e.g. Engineering" value={courseForm.department} onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Dept Code</label>
                <input type="text" placeholder="e.g. CSE / IT" value={courseForm.deptCode} onChange={(e) => setCourseForm({ ...courseForm, deptCode: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-blue-500 uppercase" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">HOD Name</label>
                <input type="text" placeholder="Head of Department" value={courseForm.hod} onChange={(e) => setCourseForm({ ...courseForm, hod: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Academic Year / Duration</label>
                <select value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer transition-all focus:border-blue-500">
                  <option value="">Select Year</option>
                  {yearsList.map(y => (
                      <option key={y._id || y.id} value={y.name}>{y.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                <input type="text" placeholder="Course details..." value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                <select value={courseForm.status} onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer transition-all focus:border-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/10 active:scale-[0.99]">
              {editId ? "Update Registry Entry" : "Commit Course to Registry"}
            </button>
          </form>
        </div>

        {/* 📋 Table Section */}
        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-[98%] mx-auto md:w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-6 py-3 border-r border-gray-300 w-[25%] text-center">Course Name</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[15%] text-center">Dept</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[10%] text-center">Code</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[15%] text-center">HOD Name</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[10%] text-center">Years</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[10%] text-center">Status</th>
                <th className="px-6 py-3 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fileCourses.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] italic">No registry records committed</td></tr>
              ) : (
                fileCourses.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-800 italic uppercase border-r border-slate-100">{c.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600 text-center italic border-r border-slate-100 uppercase">{c.department}</td>
                    <td className="px-6 py-4 text-xs font-bold text-blue-600 text-center border-r border-slate-100 uppercase">{c.deptCode || "-"}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700 text-center italic border-r border-slate-100">{c.hod || "-"}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600 text-center italic border-r border-slate-100">{c.duration}</td>
                    <td className="px-6 py-4 text-center border-r border-slate-100">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            c.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            c.status === 'Inactive' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-white text-gray-600 border border-slate-100'
                        }`}>
                            {c.status || "Active"}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(c)} className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDeleteCourse(c._id || c.id)} className="bg-[#dd4b39] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm hover:bg-[#d73925]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Settings;




