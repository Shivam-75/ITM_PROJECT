import React from "react";
import { FiTrash2, FiClock, FiLayers, FiBookOpen, FiCalendar } from "react-icons/fi";

const NoticeItem = React.memo(({ notice, onDelete }) => {
  const formattedDate = changeDate(notice);

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-100/40 p-6 md:p-8 flex flex-col group transition-all duration-300 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest italic flex items-center gap-2 w-fit">
                    <FiLayers size={10} /> {notice.department || "GENERAL ARCHIVE"}
                </span>
                <h2 className="text-xl font-[900] text-[#1e293b] uppercase tracking-tight leading-tight mt-2 min-h-[1.2em]">
                    {notice.title || "Untitled Protocol"}
                </h2>
            </div>
            
            <button 
                onClick={() => onDelete(notice?._id || notice.id)} 
                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
            >
                <FiTrash2 size={14} />
            </button>
        </div>

        <div className="space-y-2.5 py-4 border-y border-slate-50 my-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                    <FiCalendar size={12} />
                    <span className="text-[9px] font-[800] uppercase tracking-widest">Academic Year:</span>
                </div>
                <span className="text-[10px] font-black text-[#1e293b] uppercase italic">
                    {notice.year ? `${notice.year}${notice.year === 1 ? 'st' : notice.year === 2 ? 'nd' : notice.year === 3 ? 'rd' : 'th'} Year` : "Institutional Record"}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                    <FiClock size={12} />
                    <span className="text-[9px] font-[800] uppercase tracking-widest">Published On:</span>
                </div>
                <span className="text-[10px] font-black text-rose-600 italic uppercase">
                    {formattedDate || "Standard Release"}
                </span>
            </div>
        </div>

        <div className="relative">
            <div className="absolute -left-2 top-0 w-1 h-full bg-indigo-100 rounded-full opacity-50"></div>
            <p className="text-[12px] font-[700] text-slate-600 leading-relaxed uppercase italic break-words pl-4 min-h-[1.5em]">
                {notice.description || "Official announcement content is archived or temporarily unavailable."}
            </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Official Protocol Active</span>
            </div>
            <span className="text-[8px] font-black text-slate-200 tracking-tighter uppercase italic">
                ID: {(notice._id || notice.id)?.toString().slice(-8).toUpperCase() || "PENDING"}
            </span>
        </div>
    </div>
  );
});

export default NoticeItem;

export const changeDate = (notice) => {
  if (!notice?.createdAt) return null;

  try {
      const date = new Date(notice.createdAt);
      if (isNaN(date.getTime())) return null;

      const weekday = date.toLocaleDateString("en-IN", { weekday: 'long' });
      const mainDate = date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      return `${weekday}, ${mainDate} | ${time}`;
  } catch (e) {
      return null;
  }
};