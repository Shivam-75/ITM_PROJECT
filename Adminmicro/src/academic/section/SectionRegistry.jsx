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
  
  const [sectionForm, setSectionForm] = useState({
    name: "",
    strength: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/v3/Admin/Academic/sections", { withCredentials: true });
      if (res.data.data) setSections(res.data.data);
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
    if (!sectionForm.name || !sectionForm.strength) {
      return toast.error("Name and Strength are Mandatory", toststyle);
    }
    
    try {
      setLoading(true);
      if (editId) {
        await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/sections/${editId}`, { withCredentials: true });
      }
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Academic/sections", sectionForm, { withCredentials: true });
      toast.success(editId ? "Entry Updated" : res.data.message, toststyle);
      
      fetchData();
      setSectionForm({ name: "", strength: "", status: "Active" });
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
      strength: sec.strength,
      status: sec.status
    });
    setEditId(sec._id || sec.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this section from registry?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5002/api/v3/Admin/Academic/sections/${id}`, { withCredentials: true });
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
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Section Strength</label>
                <input type="text" placeholder="e.g. 60" value={sectionForm.strength} onChange={(e) => setSectionForm({ ...sectionForm, strength: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all focus:border-red-500" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Registry Status</label>
                <select value={sectionForm.status} onChange={(e) => setSectionForm({ ...sectionForm, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold bg-white cursor-pointer focus:border-red-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                <th className="px-4 py-3 border-r border-gray-300 w-[40%] text-center">Section</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[20%] text-center">Size</th>
                <th className="px-4 py-3 border-r border-gray-300 w-[20%] text-center">Status</th>
                <th className="px-4 py-3 text-center w-[20%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sections.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">No section records committed</td></tr>
              ) : (
                sections.map((s) => (
                  <tr key={s._id || s.id} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-800 italic uppercase border-r border-gray-200 text-center">{s.name}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-gray-600 text-center italic border-r border-gray-200">{s.strength}</td>
                    <td className="px-6 py-4 text-center border-r border-gray-200">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            s.status === 'Active' ? 'bg-green-100 text-green-600 border border-green-200' : 
                            s.status === 'Inactive' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-white text-gray-600 border border-gray-200'
                        }`}>
                            {s.status}
                        </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(s)} className="bg-[#3c8dbc] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#367fa9]">Edit</button>
                        <button onClick={() => handleDelete(s._id || s.id)} className="bg-[#dd4b39] text-white px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all hover:bg-[#d73925]">Delete</button>
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




