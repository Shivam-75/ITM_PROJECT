import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiEdit2,
  FiCalendar
} from "react-icons/fi";
import useAuth from "../../store/AdminStore";
import Loader from "../../components/Loader";

const SemesterRegistry = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // States
  const [semesters, setSemesters] = useState([]);
  const [semForm, setSemForm] = useState({
    name: "",
    startDate: "", 
    endDate: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/v3/Admin/Academic/file-semesters", { withCredentials: true });
      if (res.data.semesters) setSemesters(res.data.semesters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!semForm.name) return toast.error("Semester Name is Mandatory", toststyle);
    
    try {
      setLoading(true);
      if (editId) {
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-semesters/${editId}`, { withCredentials: true });
      }
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Academic/file-semesters", semForm, { withCredentials: true });
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setSemForm({ name: "", startDate: "", endDate: "", status: "Active" });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const triggerEdit = (sem) => {
    setSemForm({
      name: sem.name,
      startDate: sem.startDate,
      endDate: sem.endDate,
      status: sem.status
    });
    setEditId(sem.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this semester from registry?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-semesters/${id}`, { withCredentials: true });
      toast.success("Semester Purged", toststyle);
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
             <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <FiCalendar size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Semester Window" : "Semester Management"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Semester Name</label>
                <input type="text" placeholder="e.g. Spring 2024" value={semForm.name} onChange={(e) => setSemForm({ ...semForm, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-amber-500 uppercase" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Start Date</label>
                <input type="date" value={semForm.startDate} onChange={(e) => setSemForm({ ...semForm, startDate: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-amber-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">End Date</label>
                <input type="date" value={semForm.endDate} onChange={(e) => setSemForm({ ...semForm, endDate: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-amber-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Registry Status</label>
                <select value={semForm.status} onChange={(e) => setSemForm({ ...semForm, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-amber-500">
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg active:scale-[0.99] shadow-green-600/10">
              {editId ? "Update Semester Window" : "Commit Semester to Registry"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-[98%] mx-auto md:w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-6 py-3 border-r border-gray-300 w-[30%] text-center">Semester Window</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[20%] text-center">Start Date</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[20%] text-center">End Date</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[15%] text-center">Status</th>
                <th className="px-6 py-3 text-center w-[15%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {semesters.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No semester windows committed</td></tr>
              ) : (
                semesters.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-800 italic uppercase border-r border-gray-200">{s.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600 text-center italic border-r border-gray-200">{s.startDate || "-"}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600 text-center italic border-r border-gray-200">{s.endDate || "-"}</td>
                    <td className="px-6 py-4 text-center border-r border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            s.status === 'Active' ? 'bg-green-100 text-green-600' : 
                            s.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {s.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(s)} className="bg-[#3c8dbc] text-white px-3 py-1 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#d73925]">Delete</button>
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

export default SemesterRegistry;
