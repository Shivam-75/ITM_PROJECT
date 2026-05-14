import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiHome, FiUser, FiBookOpen, FiTrash2, FiLayers, FiShield, FiAlertTriangle } from "react-icons/fi";

const Roomallocation = () => {
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [room, setRoom] = useState("");
  const [block, setBlock] = useState("");
  const [bed, setBed] = useState("");
  
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, allocRes] = await Promise.all([
        axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/rooms", { withCredentials: true }),
        axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/allocate", { withCredentials: true })
      ]);
      
      // Group rooms by block
      const groupedRooms = roomsRes.data.rooms.reduce((acc, room) => {
        const b = room.block || "Default";
        if (!acc[b]) acc[b] = [];
        acc[b].push(room.roomNo);
        return acc;
      }, {});

      setRooms(groupedRooms);
      setAllocations(allocRes.data.allocations);
    } catch (err) {
      toast.error("Failed to sync with Hostel registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAllocate = async () => {
    if (!studentName || !course || !room || !block || !bed) {
      toast.warn("All allocation parameters are required", { theme: "colored" });
      return;
    }
 
    try {
      setSubmitting(true);
      const response = await axios.post("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/allocate", {
        studentName,
        course,
        roomNo: room,
        block,
        bed,
        studentId: `STU_${Date.now()}`
      }, { withCredentials: true });
      
      if (response.status === 201) {
        toast.success("Room Allocated Successfully", { icon: "🏠" });
        fetchData();
        
        // Reset form completely to prevent duplicate/bulk fill visual bug
        setStudentName("");
        setCourse("");
        setRoom("");
        setBlock("");
        setBed("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Allocation Protocol Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm("CRITICAL: Are you sure you want to de-allocate this room?")) {
      try {
        await axios.delete(`https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/allocate/${id}`, { withCredentials: true });
        toast.success("Allocation Revoked");
        fetchData(); // Sync with backend
      } catch (err) {
        toast.error("De-allocation Failed");
      }
    }
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Room Allocation
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Hostel Asset Management Protocol
          </p>
        </div>
      </div>

      {/* Allocation Form */}
      <div className="bg-white p-8 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 mb-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
           <FiHome size={120} className="text-blue-600" />
        </div>
        
        <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
          <span className="w-6 h-[2px] bg-blue-600"></span>
          Allocation Control
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Student Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text" placeholder="Full name"
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all italic"
                value={studentName} onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Course</label>
            <div className="relative">
              <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text" placeholder="e.g. BCA, MCA"
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all italic"
                value={course} onChange={(e) => setCourse(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Select Block</label>
            <div className="relative">
              <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <select
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all italic appearance-none cursor-pointer"
                value={block} onChange={(e) => { setBlock(e.target.value); setRoom(""); }}
              >
                <option value="">Choose Block</option>
                {Object.keys(rooms).map((b) => (
                  <option key={b} value={b}>Block {b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Room Number</label>
            <div className="relative">
              <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <select
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all italic appearance-none cursor-pointer disabled:opacity-50"
                value={room} onChange={(e) => setRoom(e.target.value)} disabled={!block}
              >
                <option value="">Choose Room</option>
                {block && rooms[block].map((r) => (
                  <option key={r} value={r}>Room {r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Bed Position</label>
            <div className="relative">
              <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <select
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all italic appearance-none cursor-pointer"
                value={bed} onChange={(e) => setBed(e.target.value)}
              >
                <option value="">Select Bed</option>
                <option value="Bed 1">Lower Berth (Bed 1)</option>
                <option value="Bed 2">Upper Berth (Bed 2)</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAllocate}
              disabled={submitting}
              className="w-full py-4 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-400 italic"
            >
              {submitting ? "Processing..." : "Authorize Allocation"}
            </button>
          </div>
        </div>
      </div>

      {/* Allocated Students Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-white/50 flex justify-between items-center">
           <h2 className="text-sm font-black text-slate-900 uppercase italic tracking-widest flex items-center gap-3">
             <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
             Deployment Registry
           </h2>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{allocations.length} Active Records</span>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4 opacity-30">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-[11px] font-black uppercase tracking-widest italic">Syncing Database...</span>
            </div>
          ) : allocations.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <FiAlertTriangle className="mx-auto text-slate-200" size={60} />
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">Inventory Vacant - No Active Allocations</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/30">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Personnel</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic font-sans text-center">Reference</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Placement</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Timeline</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allocations.map((item) => (
                  <tr key={item._id} className="group hover:bg-white/50 transition-colors">
                    <td className="p-6">
                      <p className="text-xs font-black text-slate-900 tracking-tight italic uppercase">{item.studentName || "N/A"}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{item.course || "No Course"}</p>
                    </td>
                    <td className="p-6 text-center">
                       <span className="px-3 py-1.5 bg-white rounded-lg text-[9px] font-black text-slate-600 italic border border-slate-200">{item.studentId}</span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-blue-600 italic uppercase">Block {item.block || "N/A"}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase italic tracking-tighter">Room {item.roomNo} <span className="mx-1">•</span> {item.bed || "Any Bed"}</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <p className="text-[10px] font-bold text-slate-400 italic">{new Date(item.joiningDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roomallocation;




