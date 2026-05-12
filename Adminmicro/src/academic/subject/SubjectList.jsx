import React, { useState, useEffect } from "react";
import { AcademicAPI } from "../../api/apis";
import { toast } from "react-toastify";
import { FiBookOpen } from "react-icons/fi";
import useAuth from "../../store/AdminStore";

const SubjectList = () => {
  const { toststyle } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for dynamic dropdowns
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
    status: "Active"
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, courseRes, semRes] = await Promise.all([
        AcademicAPI.get("/subjects"),
        AcademicAPI.get("/courses"),
        AcademicAPI.get("/semesters")
      ]);
      if (subRes.data.subjects) setSubjects(subRes.data.subjects);
      if (courseRes.data.data) setCourses(courseRes.data.data);
      if (semRes.data.data) setSemesters(semRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch data", toststyle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.department || !form.semester) {
      return toast.error("All mandatory fields must be filled", toststyle);
    }
 
    try {
      setLoading(true);
      if (editId !== null) {
        await AcademicAPI.delete(`/subjects/${editId}`);
      }
      
      await AcademicAPI.post("/subjects", form);
      toast.success(editId ? "Subject Updated" : "Subject Added", toststyle);
      
      fetchData();
      setForm({ name: "", code: "", department: "", semester: "", status: "Active" });
      setEditId(null);
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to save subject", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sub) => {
    setForm({
      name: sub.name,
      code: sub.code,
      department: sub.department,
      semester: sub.semester,
      status: sub.status
    });
    setEditId(sub.id || sub._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this subject from the registry?")) {
      try {
        setLoading(true);
        await AcademicAPI.delete(`/subjects/${id}`);
        toast.success("Subject Deleted", toststyle);
        fetchData();
      } catch (err) {
        toast.error("Failed to delete subject", toststyle);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 p-2 md:p-6 lg:p-10">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* ADD / EDIT FORM */}
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm w-full overflow-hidden">
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FiBookOpen size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId !== null ? "Edit Subject" : "Subject Management"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subject Name</label>
                <input type="text" name="name" placeholder="e.g. Mathematics" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Subject Code</label>
                <input type="text" name="code" placeholder="e.g. MATH101" value={form.code} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 uppercase" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Department</label>
                <select name="department" value={form.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-indigo-500 uppercase" required>
                  <option value="">Select Dept</option>
                  {courses.map(c => <option key={c._id || c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Semester</label>
                <select name="semester" value={form.semester} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-indigo-500 uppercase" required>
                  <option value="">Select Semester</option>
                  {semesters.map(s => <option key={s._id || s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-indigo-500" required>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg active:scale-[0.99] disabled:opacity-50">
              {editId !== null ? "Update Registry Entry" : "Commit Subject to Registry"}
            </button>
          </form>
        </div>

        {/* SUBJECT TABLE */}
        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-4 py-3 border-r border-gray-300 w-[25%] text-center">Subject Name</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[15%] text-center">Code</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[20%] text-center">Department</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[15%] text-center">Semester</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[10%] text-center">Status</th>
                <th className="px-4 py-3 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.length === 0 ? (
                 <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No subjects committed</td></tr>
              ) : (
                 subjects.map((sub) => (
                  <tr key={sub.id || sub._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-800 italic uppercase border-r border-slate-100">{sub.name}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-indigo-600 text-center italic border-r border-slate-100 uppercase">{sub.code}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-slate-100 uppercase">{sub.department}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-slate-100 uppercase">{sub.semester}</td>
                    <td className="px-4 py-4 text-center border-r border-slate-100">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            sub.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            'bg-red-100 text-red-600 border border-red-200'
                        }`}>
                            {sub.status || "Active"}
                        </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(sub)} className="bg-[#3c8dbc] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(sub.id || sub._id)} className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#d73925]">Delete</button>
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

export default SubjectList;
