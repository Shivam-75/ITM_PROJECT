import React, { memo, useEffect, useState, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";
import { FiEdit3, FiCalendar, FiBook, FiCheckCircle, FiArrowRight, FiX, FiFileText, FiInfo, FiClock } from "react-icons/fi";

// 🔹 Modal Component
const HomeworkModal = ({ item, onClose }) => {
  if (!item) return null;

  const postingDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";
  const submissionDate = item?.submissionDate || "N/A";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-slate-100">
        <div className="p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Academic Record</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.year}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-black tracking-tighter leading-tight break-words">{item.subject}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-gray-50 rounded-[10px] hover:bg-black hover:text-white transition-all active:scale-90"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-gray-50 p-6 rounded-[10px] border border-slate-100/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject Code</p>
                <p className="text-sm font-black text-black uppercase">{item.subject?.substring(0, 3)}-{item.semester || "NA"}</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-[10px] border border-slate-100/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Posted On</p>
                <p className="text-sm font-black text-black">{postingDate}</p>
             </div>
             <div className="bg-black p-6 rounded-[10px] shadow-xl shadow-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</p>
                <p className="text-sm font-black text-white">{submissionDate}</p>
             </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black text-white rounded-[10px] flex items-center justify-center">
                   <FiFileText size={16} />
                </div>
                <h3 className="text-sm font-black tracking-tight uppercase">Assignment Tasks</h3>
             </div>
             
             <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {item.questions?.length > 0 ? (
                  item.questions.map((q, i) => (
                    <div key={i} className="flex gap-4 items-start p-5 bg-white rounded-[10px] border border-slate-100 hover:border-black transition-all group">
                       <span className="w-6 h-6 rounded-[10px] bg-gray-50 text-gray-400 text-[10px] font-black flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                          {i + 1}
                       </span>
                       <p className="text-sm font-medium text-gray-700 leading-relaxed">
                         {q}
                       </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic text-center py-10">No specific tasks listed.</p>
                )}
             </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-4 p-5 bg-red-50 rounded-[10px] border border-red-100/50">
             <FiClock className="text-red-600 shrink-0" />
             <p className="text-[11px] font-medium text-red-700 leading-relaxed">
                Ensure submission before the deadline: <span className="font-black underline">{submissionDate}</span>. Late entries may not be evaluated by the faculty.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeworkCard = memo(({ item, onOpen }) => {
  const postingDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A";
  const submissionDate = item?.submissionDate || "N/A";

  return (
    <div className="bg-white rounded-[10px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-black text-white rounded-[10px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <FiEdit3 size={20} />
            </div>
            <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
               <p className="text-[9px] font-black uppercase tracking-widest">Submission Pending</p>
            </div>
        </div>

        <h3 className="text-xl font-black text-black tracking-tight mb-2 group-hover:text-black/70 transition-colors uppercase italic break-words">
            {item?.subject || "Subject"}
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Academic Module</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-[10px] border border-slate-100/50">
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Posted On</p>
               <p className="text-[10px] font-black text-black">{postingDate}</p>
            </div>
            <div className="bg-black p-4 rounded-[10px] shadow-lg shadow-gray-100">
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Submit By</p>
               <p className="text-[10px] font-black text-white">{submissionDate}</p>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
               <p className="text-[10px] font-black uppercase tracking-widest text-black">Task Preview</p>
               <FiBook className="text-gray-300" />
            </div>
            <div className="space-y-4">
               {item?.questions?.length > 0 ? (
                  item.questions.slice(0, 2).map((q, i) => (
                    <div key={i} className="flex gap-4 items-start p-3 rounded-[10px] hover:bg-gray-50 transition-colors">
                       <span className="w-5 h-5 rounded-[10px] bg-black text-white text-[9px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                       </span>
                       <p className="text-[11px] font-medium text-gray-700 leading-relaxed line-clamp-1">
                         {q}
                       </p>
                    </div>
                  ))
               ) : (
                  <p className="text-sm text-gray-400 font-medium">No tasks listed.</p>
               )}
            </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-50">
          <button 
            onClick={() => onOpen(item)}
            className="w-full py-4 bg-black text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-gray-100"
          >
             View Full Details <FiArrowRight />
          </button>
      </div>
    </div>
  );
});

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);

  const fetchHomework = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await WorkAPI.get("/HomeWork/getHwDpt", { withCredentials: true });
      if (Array.isArray(data?.data)) {
        setHomeworkData(data.data);
      } else {
        setHomeworkData([]);
      }
    } catch (error) {
      console.error("Homework fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* 🔹 Details Modal */}
      {selectedHomework && (
        <HomeworkModal 
          item={selectedHomework} 
          onClose={() => setSelectedHomework(null)} 
        />
      )}

       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-1 bg-black rounded-full"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Official Registry</p>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-black tracking-tight uppercase italic">Daily Homework.</h2>
          <p className="text-xs text-gray-500 font-medium max-w-sm leading-relaxed uppercase tracking-widest opacity-80">Manage and review your daily academic tasks. Ensure all submissions are completed before the due date.</p>
        </div>
        <div className="bg-gray-50 px-8 py-4 rounded-[10px] border border-slate-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
           <p className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Registry Active
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {homeworkData?.filter(item => item && item.subject).map(item => (
          <HomeworkCard 
            key={item._id} 
            item={item} 
            onOpen={(data) => setSelectedHomework(data)} 
          />
        ))}
      </div>

      {homeworkData.length === 0 && !loading && (
           <div className="py-32 text-center bg-gray-50 rounded-[10px] border border-dashed border-slate-100 mx-4">
              <div className="w-20 h-20 bg-white rounded-[10px] flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
                 <FiEdit3 className="text-gray-200" size={32} />
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">No Tasks Found</p>
           </div>
      )}
    </div>
  );
};

export default Homework;
