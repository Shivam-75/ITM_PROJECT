import { changeDate } from "../notice/NoticeItem";
import { FiMonitor, FiTrash2, FiClock, FiLayers, FiExternalLink, FiVideo, FiBookOpen, FiCalendar } from "react-icons/fi";

export default function LectureCard({ lecture, onDelete }) {
  const date = changeDate(lecture);

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-100/40 p-6 md:p-8 flex flex-col group transition-all duration-300 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-start mb-2">
            <div className="space-y-1">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest italic flex items-center gap-2 w-fit">
                    <FiVideo size={10} /> {lecture.department || "PUBLIC ACCESS"}
                </span>
                <h2 className="text-xl font-[900] text-[#1e293b] uppercase tracking-tight leading-tight mt-2 min-h-[1.2em]">
                    {lecture.topic}
                </h2>
            </div>
            
            <button 
                onClick={() => onDelete(lecture._id)} 
                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
            >
                <FiTrash2 size={14} />
            </button>
        </div>

        <div className="space-y-2.5 py-4 border-y border-slate-50 my-4">
            <div className="flex justify-between items-center text-slate-400">
                <div className="flex items-center gap-2">
                    <FiBookOpen size={12} />
                    <span className="text-[9px] font-[800] uppercase tracking-widest">Semester:</span>
                </div>
                <span className="text-[10px] font-black text-[#1e293b] uppercase italic">{lecture.semester ? `Semester ${lecture.semester}` : "N/A"}</span>
            </div>
            
            <div className="flex justify-between items-center text-slate-400">
                <div className="flex items-center gap-2">
                    <FiCalendar size={12} />
                    <span className="text-[9px] font-[800] uppercase tracking-widest">Section:</span>
                </div>
                <span className="text-[10px] font-black text-[#1e293b] uppercase italic">{lecture.section || "N/A"}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    <FiClock size={12} />
                    <span className="text-[9px] font-[800] uppercase tracking-widest">Broadcasted:</span>
                </div>
                <span className="text-[10px] font-black text-rose-600 italic uppercase">{date || "Standard Protocol"}</span>
            </div>
        </div>

        <div className="mt-4">
            <a 
                href={lecture.linkas} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3"
            >
                <FiExternalLink size={14} />
                Access Digital Classroom
            </a>
        </div>

        <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Official Protocol Active</span>
            </div>
            <span className="text-[8px] font-black text-slate-200 tracking-tighter uppercase italic">LOG_ID: {lecture._id?.slice(-8).toUpperCase()}</span>
        </div>
    </div>
  );
}