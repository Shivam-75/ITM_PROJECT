import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiAward } from "react-icons/fi";
import useAuth from "../../store/AdminStore";

const CourseList = () => {
  const { toststyle } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    department: "",
    deptCode: "",
    hod: "",
    duration: "",
    description: "",
    status: "Active"
  });

  const [editId, setEditId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", {
        withCredentials: true
      });
      if (response.data.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      toast.error("Failed to fetch courses", toststyle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department || !form.deptCode || !form.duration) {
      return toast.error("Mandatory fields (Name, Dept, Code, Duration) must be filled", toststyle);
    }
 
    try {
      setLoading(true);
      if (editId !== null) {
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/courses/${editId}`, { withCredentials: true });
      }
      
      await axios.post("http://localhost:5002/api/v3/Admin/Academic/courses", form, { withCredentials: true });
      toast.success(editId ? "Course Updated" : "Course Added", toststyle);
      
      fetchCourses();
      setForm({ name: "", department: "", deptCode: "", hod: "", duration: "", description: "", status: "Active" });
      setEditId(null);
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to save course", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      department: c.department,
      deptCode: c.deptCode,
      hod: c.hod || "",
      duration: c.duration,
      description: c.description || "",
      status: c.status
    });
    setEditId(c.id || c._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course from the registry?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/courses/${id}`, { withCredentials: true });
        toast.success("Course Deleted", toststyle);
        fetchCourses();
      } catch (err) {
        toast.error("Failed to delete course", toststyle);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 p-2 md:p-6 lg:p-10">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* ADD / EDIT FORM */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <FiAward size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId !== null ? "Edit Course" : "Course Management"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Course Name</label>
                <input type="text" name="name" placeholder="e.g. B.Tech Computer Science" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Department</label>
                <input type="text" name="department" placeholder="e.g. Engineering" value={form.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Dept Code</label>
                <input type="text" name="deptCode" placeholder="e.g. CS-ENG" value={form.deptCode} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500 uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">HOD Name</label>
                <input type="text" name="hod" placeholder="e.g. Dr. Smith" value={form.hod} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Duration</label>
                <input type="text" name="duration" placeholder="e.g. 4 Years" value={form.duration} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500" required />
              </div>

              <div className="space-y-1 xl:col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                <input type="text" name="description" placeholder="Brief description of the course" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-purple-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-purple-500" required>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg active:scale-[0.99] disabled:opacity-50">
              {editId !== null ? "Update Registry Entry" : "Commit Course to Registry"}
            </button>
          </form>
        </div>

        {/* COURSE TABLE */}
        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-4 py-3 border-r border-gray-300 w-[20%] text-center">Course Name</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[15%] text-center">Dept & Code</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[15%] text-center">HOD</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[10%] text-center">Duration</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[15%] text-center">Description</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[10%] text-center">Status</th>
                <th className="px-4 py-3 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.length === 0 ? (
                 <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No courses committed</td></tr>
              ) : (
                 courses.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-800 italic uppercase border-r border-gray-200">{c.name}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-purple-600 text-center italic border-r border-gray-200 uppercase">{c.department} <br/><span className="text-[8px] text-gray-500">{c.deptCode}</span></td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200 uppercase">{c.hod || "-"}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200 uppercase">{c.duration}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-500 text-center italic border-r border-gray-200">{c.description || "-"}</td>
                    <td className="px-4 py-4 text-center border-r border-gray-200">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            c.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            'bg-red-100 text-red-600 border border-red-200'
                        }`}>
                            {c.status || "Active"}
                        </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(c)} className="bg-[#3c8dbc] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(c.id || c._id)} className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#d73925]">Delete</button>
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

export default CourseList;
