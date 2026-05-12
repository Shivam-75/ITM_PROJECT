import React, { useState, useEffect } from "react";
import { AcademicAPI } from "../../api/apis";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiEdit2,
  FiHome
} from "react-icons/fi";
import useAuth from "../../store/AdminStore";
import Loader from "../../components/Loader";

const DepartmentRegistry = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // States
  const [departments, setDepartments] = useState([]);
  const [deptForm, setDeptForm] = useState({
    name: "",
    code: "", 
    hod: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await AcademicAPI.get("/departments");
      if (res.data.departments) setDepartments(res.data.departments);
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
    if (!deptForm.name || !deptForm.code) {
      return toast.error("Name and Code are Mandatory", toststyle);
    }
    
    try {
      setLoading(true);
      if (editId) {
        await AcademicAPI.delete(`/departments/${editId}`);
      }
      const res = await AcademicAPI.post("/departments", deptForm);
      toast.success(editId ? "Entry Updated" : "Department Added", toststyle);
      
      fetchData();
      setDeptForm({ name: "", code: "", hod: "" });
      setEditId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Error", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const triggerEdit = (dept) => {
    setDeptForm({
      name: dept.name,
      code: dept.code,
      hod: dept.hod
    });
    setEditId(dept.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this department from registry?")) return;
    try {
      setLoading(true);
      await AcademicAPI.delete(`/departments/${id}`);
      toast.success("Department Purged", toststyle);
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
        
        <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden w-full">
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <FiHome size={20} />
             </div>
            <h1 className="text-xl font-bold text-gray-900 font-sans uppercase italic tracking-tight">
              {editId ? "Edit Department Details" : "Add New Department"}
            </h1>
          </div>

          <form onSubmit={handleExecute} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Department Name (e.g. CSE)"
                value={deptForm.name}
                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all uppercase"
              />
              <input 
                type="text" 
                placeholder="Dept Code"
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none transition-all uppercase"
              />
              <input 
                type="text" 
                placeholder="HOD Name"
                value={deptForm.hod}
                onChange={(e) => setDeptForm({ ...deptForm, hod: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm font-semibold outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-md font-bold uppercase tracking-widest text-[13px] transition-all"
            >
              {editId ? "Update Registry Entry" : "Commit Department to Registry"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 rounded-sm shadow-md overflow-hidden w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f4f4] border-b border-gray-300 text-[12px] font-black uppercase text-gray-700">
                <th className="px-6 py-3 border-r border-gray-300 w-[30%] text-center">Department</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[20%] text-center">Code</th>
                <th className="px-6 py-3 border-r border-gray-300 w-[25%] text-center">HOD</th>
                <th className="px-6 py-3 text-center w-[25%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-xs">No department records found</td></tr>
              ) : (
                departments.map((d) => (
                  <tr key={d.id} className="hover:bg-white/50">
                    <td className="px-6 py-4 text-xs font-bold text-gray-800 italic uppercase border-r border-slate-100">{d.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-blue-600 text-center border-r border-slate-100 uppercase">{d.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600 text-center italic border-r border-slate-100 uppercase">{d.hod}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => triggerEdit(d)} className="bg-[#3c8dbc] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider">Edit</button>
                        <button onClick={() => handleDelete(d.id)} className="bg-[#dd4b39] text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider">Delete</button>
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

export default DepartmentRegistry;




