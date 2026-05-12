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
  FiChevronRight
} from "react-icons/fi";
import { useAuth } from "../store/AuthStore";
import Loader from "../components/common/Loader";

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
      toast.success(`Applied for ${drive.companyName}`, toaststyle);
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
    <div className="space-y-10 animate-in fade-in duration-1000 p-2 md:p-6 lg:p-10">
      {loading && <Loader />}

      {/* Hero Header */}
      <div className="bg-white p-12 rounded-lg text-gray-900 border border-slate-100 shadow-sm relative overflow-hidden shadow-2xl shadow-gray-200">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600 rounded-full -mr-32 -mt-32 blur-[120px] opacity-20 animate-pulse"></div>
        <div className="relative z-10 space-y-6">
           <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-lg italic border border-white/5 backdrop-blur-md">Career Advancement Center</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                 <FiZap size={10} /> Active Recruitment Phase
              </span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
             Future <span className="text-red-600">Forge</span>
           </h1>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
             Connect with industry leaders and launch your professional journey. Your academic excellence meets corporate opportunity here.
           </p>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {drives.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-lg border border-slate-100 shadow-sm">
             <FiBriefcase size={48} className="mx-auto text-gray-100 mb-6" />
             <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.4em] italic">No active placement windows</p>
          </div>
        ) : (
          drives.map((drive) => (
            <div key={drive._id} className="bg-white rounded-lg p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="flex justify-between items-start relative z-10 mb-8">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform duration-500">
                        <FiBriefcase size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">{drive.companyName}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{drive.jobProfile}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-gray-900 leading-none italic">{drive.ctc} <span className="text-[10px] uppercase tracking-widest text-gray-400 not-italic ml-1">LPA</span></p>
                     <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1">Package Offered</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                  <div className="p-4 bg-white rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><FiTarget /> Eligibility</p>
                     <p className="text-[10px] font-black text-gray-800 uppercase italic line-clamp-1">{drive.eligibility}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-100 group-hover:bg-white transition-colors">
                     <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><FiCalendar /> Deadline</p>
                     <p className="text-[10px] font-black text-red-600 uppercase italic">{new Date(drive.deadline).toLocaleDateString()}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 relative z-10">
                  <button 
                    onClick={() => setSelectedDrive(drive)}
                    className="flex-1 py-4 bg-white text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg hover:bg-black hover:text-white transition-all italic border border-transparent hover:border-white/10"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleApply(drive)}
                    disabled={isApplied(drive._id)}
                    className={`flex-[1.5] py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all italic shadow-xl ${
                      isApplied(drive._id) 
                        ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-100' 
                        : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
                    }`}
                  >
                    {getStatus(drive._id)}
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 bg-[#111111] text-white flex justify-between items-start relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl"></div>
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">{selectedDrive.companyName}</h3>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Drive Details</p>
                 </div>
                 <button onClick={() => setSelectedDrive(null)} className="relative z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">
                    <FiCheckCircle size={20} className="rotate-45" />
                 </button>
              </div>

              <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Role</p>
                       <p className="text-sm font-black text-gray-900 uppercase italic">{selectedDrive.jobProfile}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Package</p>
                       <p className="text-sm font-black text-red-600 uppercase italic">{selectedDrive.ctc} LPA</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] italic border-b border-slate-100 pb-2 flex items-center gap-2"><FiInfo /> Description</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed tracking-wide">{selectedDrive.description}</p>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] italic border-b border-slate-100 pb-2 flex items-center gap-2"><FiTarget /> Requirements</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed tracking-wide">{selectedDrive.eligibility}</p>
                 </div>

                 <div className="flex items-center gap-4 pt-6">
                    <button 
                      onClick={() => handleApply(selectedDrive)}
                      disabled={isApplied(selectedDrive._id)}
                      className={`w-full py-5 rounded-lg text-[11px] font-black uppercase tracking-[0.4em] transition-all italic shadow-2xl ${
                        isApplied(selectedDrive._id) 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'
                      }`}
                    >
                      {getStatus(selectedDrive._id)}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Placements;



