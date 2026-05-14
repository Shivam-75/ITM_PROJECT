import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader";
import { 
  FiPlus, FiX, FiTrash2, FiActivity, FiHome, FiDollarSign, FiClock 
} from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../store/AdminStore";

const HostelFeeRegistry = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feeStructures, setFeeStructures] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    roomType: "",
    hostelType: "",
    amount: "",
    academicYear: "",
    description: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feeRes, batchRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Hostel/fees", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/batches", { withCredentials: true })
      ]);

      if (feeRes.data.fees) setFeeStructures(feeRes.data.fees);
      if (batchRes.data.batches) setBatches(batchRes.data.batches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Hostel/fees", formData, { withCredentials: true });
      toast.success(res.data.message, toststyle);
      setShowModal(false);
      setFormData({ roomType: "", hostelType: "", amount: "", academicYear: "", description: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this hostel fee structure?")) return;
    try {
      setLoading(true);
      // Assuming a delete route exists or needs to be added
      await axios.delete(`http://localhost:5002/api/v3/Admin/Hostel/fees/${id}`, { withCredentials: true });
      toast.success("Structure Purged", toststyle);
      fetchData();
    } catch (err) {
      toast.error("Purge Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && <Loader />}
      
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Hostel Fee Registry</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Master Configuration for Residentials</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#0f172a] text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic shadow-lg flex items-center gap-3 hover:scale-105 transition-all"
        >
          <FiPlus size={16} />
          Create Fee Window
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeStructures.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <FiHome size={60} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest italic">No hostel fee structures committed</p>
          </div>
        ) : (
          feeStructures.map((f) => (
            <div key={f._id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative group">
              <div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all">
                <button onClick={() => handleDelete(f._id)} className="text-gray-300 hover:text-red-500 p-2">
                  <FiTrash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${f.hostelType === 'Boys' ? 'bg-white border border-slate-100 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                   <FiHome size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase italic">{f.roomType}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{f.hostelType}'s Residence</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                   <span className="text-[9px] font-bold text-gray-400 uppercase italic">Financial Batch</span>
                   <span className="text-xs font-black text-gray-700">{f.academicYear}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                   <span className="text-[9px] font-bold text-gray-400 uppercase italic">Annual Commitment</span>
                   <span className="text-lg font-black text-emerald-600 italic">₹{f.amount.toLocaleString()}</span>
                </div>
              </div>
              
              {f.description && (
                <p className="mt-4 text-[10px] text-gray-500 italic line-clamp-2 leading-relaxed">
                  * {f.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🚀 Publication Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSubmit}>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Publish Hostel Fee</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Residential Rate Card</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900">
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Room Type</label>
                  <select 
                    required value={formData.roomType}
                    onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Configuration</option>
                    <option value="Single Seater (AC)">Single Seater (AC)</option>
                    <option value="Double Seater (AC)">Double Seater (AC)</option>
                    <option value="Triple Seater (AC)">Triple Seater (AC)</option>
                    <option value="Single Seater (Non-AC)">Single Seater (Non-AC)</option>
                    <option value="Double Seater (Non-AC)">Double Seater (Non-AC)</option>
                    <option value="Triple Seater (Non-AC)">Triple Seater (Non-AC)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Hostel Type</label>
                  <select 
                    required value={formData.hostelType}
                    onChange={(e) => setFormData({...formData, hostelType: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Academic Batch</label>
                  <select 
                    required value={formData.academicYear}
                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Annual Fee (₹)</label>
                  <input 
                    type="number" required placeholder="65000"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Internal Description</label>
                  <textarea 
                    placeholder="Include inclusions like food, electricity, laundry..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all h-24 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  className="px-12 py-4 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest text-[11px] italic shadow-xl shadow-gray-200 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Commit to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelFeeRegistry;
