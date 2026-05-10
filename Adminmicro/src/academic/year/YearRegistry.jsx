import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiEdit2,
  FiAward
} from "react-icons/fi";
import useAuth from "../../store/AdminStore";
import Loader from "../../components/Loader";

const YearRegistry = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // States
  const [years, setYears] = useState([]);
  const [yearForm, setYearForm] = useState({
    name: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/v3/Admin/Academic/file-years", { withCredentials: true });
      if (res.data.years) setYears(res.data.years);
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
    if (!yearForm.name) return toast.error("Year Name is Mandatory", toststyle);
    
    try {
      setLoading(true);
      if (editId) {
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-years/${editId}`, { withCredentials: true });
      }
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Academic/file-years", yearForm, { withCredentials: true });
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setYearForm({ name: "", status: "Active" });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const triggerEdit = (y) => {
    setYearForm({
      name: y.name,
      status: y.status
    });
    setEditId(y.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this academic year window?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/file-years/${id}`, { withCredentials: true });
      toast.success("Year Purged", toststyle);
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
             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FiAward size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Academic Year" : "Year Management"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Academic Year</label>
                <input type="text" placeholder="e.g. 2024-25" value={yearForm.name} onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Registry Status</label>
                <select value={yearForm.status} onChange={(e) => setYearForm({ ...yearForm, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-indigo-500">
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all shadow-lg active:scale-[0.99] shadow-green-600/10">
              {editId ? "Update Year Window" : "Commit Year to Registry"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-[98%] mx-auto md:w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[11px] font-black uppercase text-gray-700">
                <th className="px-6 py-3 border-r border-gray-300 w-[50%] text-center">Academic Year Window</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[25%] text-center">Status</th>
                <th className="px-6 py-3 text-center w-[25%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {years.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No academic year windows committed</td></tr>
              ) : (
                years.map((y) => (
                  <tr key={y.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-800 italic uppercase border-r border-gray-200">{y.name}</td>
                    <td className="px-6 py-4 text-center border-r border-gray-200">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            y.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            y.status === 'Upcoming' ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                            {y.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(y)} className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(y.id)} className="bg-[#dd4b39] text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#d73925]">Delete</button>
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

export default YearRegistry;
