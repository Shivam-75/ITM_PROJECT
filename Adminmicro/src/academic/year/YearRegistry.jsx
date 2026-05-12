import React, { useState, useEffect } from "react";
import { AcademicAPI } from "../../api/apis";
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
    startingYear: "",
    endingYear: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AcademicAPI.get("/years");
      if (res.data.data) setYears(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-generate Academic Year (name)
  useEffect(() => {
    if (yearForm.startingYear && yearForm.endingYear) {
      const start = yearForm.startingYear.trim();
      const end = yearForm.endingYear.trim();
      const suffix = end.length >= 2 ? end.slice(-2) : end;
      setYearForm(prev => ({ ...prev, name: `${start}-${suffix}` }));
    } else if (!editId && (!yearForm.startingYear || !yearForm.endingYear)) {
      // Clear name if one is empty when creating
      setYearForm(prev => ({ ...prev, name: "" }));
    }
  }, [yearForm.startingYear, yearForm.endingYear, editId]);

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!yearForm.name || !yearForm.startingYear || !yearForm.endingYear) return toast.error("All Year Fields are Mandatory", toststyle);
    
    try {
      setLoading(true);
      if (editId) {
        await AcademicAPI.delete(`/years/${editId}`);
      }
      const res = await AcademicAPI.post("/years", yearForm);
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setYearForm({ name: "", startingYear: "", endingYear: "", status: "Active" });
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
      startingYear: y.startingYear,
      endingYear: y.endingYear,
      status: y.status
    });
    setEditId(y._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this academic year window?")) return;
    try {
      setLoading(true);
      await AcademicAPI.delete(`/years/${id}`);
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
        
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden w-[98%] mx-auto md:w-full">
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-white border border-slate-100 text-indigo-600 rounded-lg">
                <FiAward size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Academic Year" : "Year Management"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Academic Year</label>
                <input type="text" placeholder="Auto-generated (e.g. 2024-25)" value={yearForm.name} readOnly className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none bg-gray-50 text-gray-500 cursor-not-allowed transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Starting Year</label>
                <input type="text" placeholder="e.g. 2024" value={yearForm.startingYear} onChange={(e) => setYearForm({ ...yearForm, startingYear: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Ending Year</label>
                <input type="text" placeholder="e.g. 2028" value={yearForm.endingYear} onChange={(e) => setYearForm({ ...yearForm, endingYear: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-indigo-500" />
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
                <th className="px-6 py-3 border-r border-gray-300 w-[25%] text-center">Academic Year</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[20%] text-center">Start</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[20%] text-center">End</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[15%] text-center">Status</th>
                <th className="px-6 py-3 text-center w-[20%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {years.length === 0 ? (
                <tr><td colSpan="3" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No academic year windows committed</td></tr>
              ) : (
                years.map((y) => (
                  <tr key={y._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-800 italic uppercase border-r border-slate-100 text-center">{y.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 italic uppercase border-r border-slate-100 text-center">{y.startingYear}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500 italic uppercase border-r border-slate-100 text-center">{y.endingYear}</td>
                    <td className="px-6 py-4 text-center border-r border-slate-100">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            y.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            y.status === 'Upcoming' ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-white text-gray-600 border border-slate-100'
                        }`}>
                            {y.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(y)} className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(y._id)} className="bg-[#dd4b39] text-white px-4 py-1.5 rounded text-[9px] font-bold uppercase transition-all shadow-sm hover:bg-[#d73925]">Delete</button>
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




