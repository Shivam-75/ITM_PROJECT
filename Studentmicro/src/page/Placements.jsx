import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiBriefcase, 
  FiClock, 
  FiCheckCircle, 
  FiInfo, 
  FiDollarSign, 
  FiCalendar,
  FiTarget,
  FiZap,
  FiArrowRight,
  FiX,
  FiAward,
  FiActivity
} from "react-icons/fi";
import { useAuth } from "../store/AuthStore";
import Loader from "../components/common/Loader";

// 🔹 Drive Detail Modal
const DriveModal = ({ drive, onClose, onApply, isApplied, status }) => {
  if (!drive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">Placement Drive</span>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{drive.year || "2026-27"}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter uppercase leading-tight">{drive.companyName}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 text-gray-400 rounded-[10px] hover:bg-black hover:text-white transition-all active:scale-90"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Compact Details Grid */}
          <div className="grid grid-cols-3 gap-3">
             <div className="bg-gray-50/50 p-4 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Role</p>
                <p className="text-[10px] font-black text-black uppercase truncate">{drive.jobProfile}</p>
             </div>
             <div className="bg-gray-50/50 p-4 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Package</p>
                <p className="text-[10px] font-black text-black">{drive.ctc} LPA</p>
             </div>
             <div className="bg-gray-50/50 p-4 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Deadline</p>
                <p className="text-[10px] font-black text-black uppercase">{new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
             </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-black text-white rounded-[10px] flex items-center justify-center">
                   <FiActivity size={14} />
                </div>
                <h3 className="text-sm font-black tracking-tight uppercase">Job Overview</h3>
             </div>
             
             <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-[10px] border border-slate-100">
                   <p className="text-[9px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-2">Description</p>
                   <p className="text-[11px] font-medium text-gray-600 leading-relaxed line-clamp-3 break-words">{drive.description || "Detailed description will be shared during the pre-placement talk."}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-[10px] border border-slate-100">
                   <p className="text-[9px] font-black text-black uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-2">Eligibility Criteria</p>
                   <p className="text-[11px] font-medium text-gray-600 leading-relaxed line-clamp-2 break-words">{drive.eligibility}</p>
                </div>
             </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
             <button 
                onClick={() => onApply(drive)}
                disabled={isApplied}
                className={`w-full py-4 rounded-[10px] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                  isApplied 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default' 
                    : 'bg-black text-white hover:bg-gray-900 shadow-gray-200'
                }`}
             >
                {isApplied ? <FiCheckCircle size={16} /> : <FiZap size={16} />}
                {status}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Placements = () => {
  const { student, toaststyle } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applications, setApplications] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [drivesRes, appsRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Placement/drives"),
        axios.get(`http://localhost:5002/api/v3/Admin/Placement/applications?studentId=${student?.studentId}`)
      ]);
      setDrives(drivesRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [student]);

  useEffect(() => {
    if (student) fetchData();
  }, [student, fetchData]);

  const handleApply = async (drive) => {
    if (!student) return toast.error("Authentication required", toaststyle);
    
    try {
      setLoading(true);
      await axios.post("http://localhost:5002/api/v3/Admin/Placement/apply", {
        placementId: drive._id,
        studentId: student.studentId,
        studentName: student.name,
        course: student.course,
        semester: student.semester,
        studentMobile: student.moNumber
      });
      toast.success(`Successfully Applied for ${drive.companyName}`, toaststyle);
      fetchData();
      setSelectedDrive(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Application Failed", toaststyle);
    } finally {
      setLoading(false);
    }
  };

  const isApplied = (driveId) => applications.some(app => app.placementId === driveId);
  const getStatus = (driveId) => applications.find(app => app.placementId === driveId)?.status || "Apply Now";

  return (
    <div className="min-h-screen bg-rose-50/50">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-6">
        {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-[150]">
            <Loader />
          </div>
        )}

        {/* Detail Modal */}
        {selectedDrive && (
          <DriveModal 
             drive={selectedDrive} 
             onClose={() => setSelectedDrive(null)} 
             onApply={handleApply}
             isApplied={isApplied(selectedDrive._id)}
             status={getStatus(selectedDrive._id)}
          />
        )}

        {/* 🚀 PREMIUM PLACEMENT REGISTRY TABLE */}
        <div className="bg-white rounded-[10px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* Table Header Overlay */}
          <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-gray-50/50 to-transparent">
             <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-1 bg-black rounded-full"></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Active Registry</p>
                </div>
                <h2 className="text-xl font-black text-black tracking-tighter uppercase italic">Placement Opportunities.</h2>
             </div>
             <div className="flex items-center gap-4">
                <div className="bg-black text-white px-6 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                   {drives.length} Drives Active
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">#</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">Company</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">Role Profile</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">CTC (LPA)</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">Eligibility</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">Deadline</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-slate-100 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {drives.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="8" className="py-48 text-center">
                      <div className="flex flex-col items-center opacity-30">
                         <FiBriefcase size={56} className="mb-6 text-gray-300" />
                         <p className="text-sm font-black uppercase tracking-[0.5em]">Registry Empty</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  drives.map((drive, index) => {
                    const applied = isApplied(drive._id);
                    const statusText = getStatus(drive._id);
                    
                    return (
                      <tr key={drive._id} className="group hover:bg-gray-50 transition-all duration-300">
                        <td className="px-10 py-8">
                           <span className="text-xs font-black text-gray-300">{(index + 1).toString().padStart(2, '0')}</span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-black text-white rounded-[10px] flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform duration-500">
                                <FiBriefcase size={24} />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[12px] font-black text-black uppercase tracking-tight group-hover:text-black/60 transition-colors">{drive.companyName}</p>
                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{drive.year || "2026-27"}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="px-4 py-1.5 bg-gray-50 text-black text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                            {drive.jobProfile}
                          </span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-baseline gap-1.5">
                             <span className="text-xl font-black text-black tracking-tighter leading-none">{drive.ctc}</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LPA</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-tight max-w-[140px] truncate">{drive.eligibility}</p>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex flex-col">
                              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Apply Before</span>
                              <span className="text-xs font-black text-black uppercase flex items-center gap-2 italic">
                                 <FiCalendar size={14} />
                                 {new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className={`px-5 py-2 rounded-[10px] text-[9px] font-black uppercase tracking-[0.2em] border text-center w-fit ${
                             applied 
                               ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                               : 'bg-black text-white border-black shadow-[0_5px_15px_-5px_rgba(0,0,0,0.3)]'
                           }`}>
                             {statusText}
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button 
                             onClick={() => setSelectedDrive(drive)}
                             className="w-12 h-12 bg-black text-white rounded-[10px] hover:bg-gray-800 transition-all active:scale-95 shadow-xl flex items-center justify-center group/btn"
                           >
                             <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placements;
