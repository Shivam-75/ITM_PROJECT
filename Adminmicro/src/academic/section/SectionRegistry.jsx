import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiEdit2,
  FiLayers
} from "react-icons/fi";
import useAuth from "../../store/AdminStore";
import Loader from "../../components/Loader";

const SectionRegistry = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // States
  const [sections, setSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  
  const [sectionForm, setSectionForm] = useState({
    name: "",
    course: "", 
    semester: "",
    roomNo: "",
    year: "",
    strength: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [secRes, courseRes, semRes, yearRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Academic/file-sections", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/file-courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/file-semesters", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/file-years", { withCredentials: true })
      ]);
      
      if (secRes.data.sections) setSections(secRes.data.sections);
      if (courseRes.data.courses) setCourses(courseRes.data.courses);
      if (semRes.data.semesters) setSemesterList(semRes.data.semesters);
      if (yearRes.data.years) setYearsList(yearRes.data.years);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registry data", toststyle);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!sectionForm.name || !sectionForm.course) {
      return toast.error("Name and Course are Mandatory", toststyle);
    }
    
    try {
      setLoading(true);
      if (editId) {
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-sections/${editId}`, { withCredentials: true });
      }
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Academic/file-sections", sectionForm, { withCredentials: true });
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setSectionForm({ name: "", course: "", semester: "", roomNo: "", year: "", strength: "" });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const triggerEdit = (sec) => {
    setSectionForm({
      name: sec.name,
      course: sec.course,
      semester: sec.semester || "",
      roomNo: sec.roomNo || "",
      year: sec.year || "",
      strength: sec.strength
    });
    setEditId(sec.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this section from registry?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-sections/${id}`, { withCredentials: true });
      toast.success("Section Purged", toststyle);
      fetchData();
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
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-[98%] mx-auto md:w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <FiLayers size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Section Details" : "Section Management"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Section Name</label>
                <input type="text" placeholder="e.g. Section A" value={sectionForm.name} onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-red-500 uppercase" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Associated Course</label>
                <select value={sectionForm.course} onChange={(e) => setSectionForm({ ...sectionForm, course: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-red-500">
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Semester</label>
                <select value={sectionForm.semester} onChange={(e) => setSectionForm({ ...sectionForm, semester: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-red-500">
                  <option value="">Select Semester</option>
                  {semesterList.map(s => (
                      <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Academic Year</label>
                <select value={sectionForm.year} onChange={(e) => setSectionForm({ ...sectionForm, year: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-red-500">
                  <option value="">Select Year</option>
                  {yearsList.map(y => (
                      <option key={y.id} value={y.name}>{y.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Room Number</label>
                <input type="text" placeholder="e.g. B-101" value={sectionForm.roomNo} onChange={(e) => setSectionForm({ ...sectionForm, roomNo: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-red-500 uppercase" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Section Strength</label>
                <input type="text" placeholder="e.g. 60" value={sectionForm.strength} onChange={(e) => setSectionForm({ ...sectionForm, strength: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-red-500" />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg shadow-green-600/10 active:scale-[0.99]">
              {editId ? "Update Registry Entry" : "Commit Section to Registry"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-[98%] mx-auto md:w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-4 py-3 border-r border-gray-300 w-[12%] text-center">Section</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[20%] text-center">Course</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[12%] text-center">Semester</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[12%] text-center">Year</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[10%] text-center">Room</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[10%] text-center">Size</th>
                <th className="px-4 py-3 text-center w-[12%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sections.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No section records committed</td></tr>
              ) : (
                sections.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-800 italic uppercase border-r border-gray-200">{s.name}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-red-600 text-center italic border-r border-gray-200 uppercase">{s.course}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200 uppercase">{s.semester ? `${s.semester}th Sem` : "-"}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200">{s.year || "-"}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-blue-600 text-center border-r border-gray-200 uppercase">{s.roomNo || "-"}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200">{s.strength}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(s)} className="bg-[#3c8dbc] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#d73925]">Delete</button>
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

export default SectionRegistry;
