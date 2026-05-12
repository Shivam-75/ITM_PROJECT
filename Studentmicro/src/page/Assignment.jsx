import React, { memo, useState, useEffect, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";
import { FiLayers, FiCalendar, FiBookOpen, FiClock, FiArrowRight, FiActivity, FiX, FiInfo, FiCheckCircle } from "react-icons/fi";

// 🔹 Assignment Modal Component
const AssignmentModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">Project Unit</span>
                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{item.year || "2026-27"}</span>
              </div>
              <h2 className="text-2xl font-black text-black tracking-tighter uppercase leading-tight break-words">{item.subject}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 text-gray-400 rounded-[10px] hover:bg-black hover:text-white transition-all active:scale-90"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-50/50 p-4 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Academic Year</p>
                <p className="text-[10px] font-black text-black">{item.year || "2026-27"}</p>
             </div>
             <div className="bg-gray-50/50 p-4 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Submission Date</p>
                <p className="text-[10px] font-black text-black">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-black text-white rounded-[10px] flex items-center justify-center">
                   <FiActivity size={14} />
                </div>
                <h3 className="text-sm font-black tracking-tight uppercase">Full Project Objectives</h3>
             </div>
             
             <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {item.questions?.length > 0 ? (
                  item.questions.map((q, i) => (
                    <div key={i} className="flex gap-3 items-start p-4 bg-white rounded-[10px] border border-slate-100 hover:border-black transition-all group">
                       <span className="w-6 h-6 rounded-lg bg-gray-50 text-gray-400 text-[10px] font-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                          {i + 1}
                       </span>
                       <p className="text-[11px] font-medium text-gray-700 leading-relaxed">
                         {q}
                       </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 italic text-center py-8 border-2 border-dashed border-gray-50 rounded-[10px]">No specific objectives provided.</p>
                )}
             </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[10px] border border-slate-100">
             <FiInfo className="text-black shrink-0" size={14} />
             <p className="text-[9px] font-medium text-gray-600 leading-relaxed">
                Important: Late submissions will result in credit deductions. Ensure all supporting documentation is attached.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentCard = memo(({ item, onOpen }) => {
  const dueDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "N/A";

  return (
    <div className="bg-white rounded-[10px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-black text-white rounded-[10px] flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
               <FiLayers size={22} />
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-black uppercase tracking-widest mb-1 italic">Due Soon</span>
               <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
            </div>
        </div>

        <h3 className="text-xl font-black text-black tracking-tight mb-1.5 leading-tight uppercase italic break-words">
            {item?.subject || "Subject"}
        </h3>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 border-b border-gray-50 pb-4">Academic Module</p>

        <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-[10px] border border-slate-100">
               <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Submission Window</p>
                  <p className="text-[11px] font-black text-black uppercase">{dueDate}</p>
               </div>
               <FiCalendar className="text-gray-300" size={16} />
            </div>
            
            <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-black flex items-center gap-2">
                   <FiActivity size={10} className="text-black" />
                   Objectives
                </p>
                <div className="space-y-3">
                   {item?.questions?.length > 0 ? (
                      item.questions.slice(0, 2).map((q, i) => (
                        <div key={i} className="flex gap-3 items-start group/q">
                           <span className="w-5 h-5 rounded-lg bg-gray-100 border border-slate-100 flex items-center justify-center text-black text-[9px] font-black shrink-0 group-hover/q:bg-black group-hover/q:text-white transition-all">
                              {i + 1}
                           </span>
                           <p className="text-[11px] font-medium text-gray-600 leading-relaxed line-clamp-1">
                             {q}
                           </p>
                        </div>
                      ))
                   ) : (
                      <p className="text-[10px] text-gray-400 font-medium italic">No specific objectives provided.</p>
                   )}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-4">
          <button 
            onClick={() => onOpen(item)}
            className="w-full py-4 bg-black text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
             View Details <FiArrowRight />
          </button>
      </div>
    </div>
  );
});

const Assignment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await WorkAPI.get("/Assignment/getAssDpt", { withCredentials: true });
      if (Array.isArray(res.data?.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Assignment fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* 🔹 Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal 
          item={selectedAssignment} 
          onClose={() => setSelectedAssignment(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-6">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
             <div className="w-12 h-1.5 bg-black rounded-full"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Official Registry</p>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none">
            Assignment.
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">
            Review and complete your final project objectives. Ensure all technical documentation is attached before the submission window closes.
          </p>
        </div>
        
        <div className="bg-black text-white p-6 rounded-[10px] shadow-2xl space-y-3 w-full md:w-64 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Next Deadline</p>
            <div className="flex items-center gap-4">
               <FiClock className="text-white/40" size={24} />
               <h3 className="text-xl font-black tracking-tight uppercase">14 May <span className="text-[10px] text-white/40">2026</span></h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
        {data.filter((item) => item && item.subject).map((item, index) => (
          <AssignmentCard 
            key={item._id || index} 
            item={item} 
            onOpen={(data) => setSelectedAssignment(data)} 
          />
        ))}
      </div>

      {data.length === 0 && !loading && (
        <div className="py-20 text-center bg-gray-50 rounded-[10px] border border-slate-100 mx-6">
           <FiLayers size={32} className="text-gray-200 mx-auto mb-4" />
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">No Assignment Records Found</p>
        </div>
      )}
    </div>
  );
};

export default Assignment;
