import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { FiTv, FiPlay, FiUser, FiCalendar, FiClock, FiVideo, FiArrowRight, FiActivity } from "react-icons/fi";
import { WorkAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";

const LectureCard = memo(({ lecture }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col group overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500">
      
      {/* Visual Header / Thumbnail Mockup */}
      <div className="h-56 bg-slate-900 relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-60 z-10"></div>
         
         <div className="relative z-20 flex flex-col items-center gap-4 group/btn">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl group-hover/btn:scale-110 transition-transform duration-500">
               <FiPlay className="text-white ml-1 group-hover/btn:text-indigo-400 transition-colors" size={28} />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] opacity-60 group-hover/btn:opacity-100 transition-opacity">Launch Session</span>
         </div>

         {/* Backdrop Icon */}
         <FiVideo className="absolute text-white/5 -bottom-10 -right-10 rotate-12" size={200} />
         
         <div className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">
            <FiActivity className="animate-pulse" /> Live Now
         </div>
         
         <div className="absolute bottom-6 left-6 z-20 px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-black rounded-lg border border-white/10">
            {lecture.department || "ITM ACADEMY"}
         </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-3">
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] italic flex items-center gap-2">
              <FiTv /> DIGITAL ARCHIVE
           </p>
           <h3 className="text-xl font-black text-slate-800 line-clamp-2 uppercase italic tracking-tighter leading-[1.1]">
             {lecture.topic}
           </h3>
           <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-slate-400">
                 <FiUser size={12} />
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight italic">Verified Academic Host</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
           <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Enrollment Key</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 italic">
                 <FiTv size={12} className="text-indigo-600" />
                 {lecture.section || "MASTER"}
              </div>
           </div>
           <div className="space-y-1 border-l border-slate-50 pl-4">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Released On</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 italic">
                 <FiCalendar size={12} className="text-indigo-600" />
                 {new Date(lecture.createdAt).toLocaleDateString()}
              </div>
           </div>
        </div>
      </div>

      <div className="px-8 pb-8 mt-auto">
          <a
            href={lecture.linkas}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-xl shadow-slate-100 active:scale-95 italic"
          >
            Access Session <FiArrowRight size={14} />
          </a>
      </div>
    </div>
  );
});

const OnlineClass = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const fetchLectures = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await authAPI.get("/userProfile");
      const student = profileRes.data?.StudentData;
      setStudentInfo(student);

      const { data } = await WorkAPI.get("/Link/getLinkDpt");
      if (data?.data && Array.isArray(data.data)) {
        // Since getLinkDpt might fetch all, we filter on client if server doesn't filter perfectly
        setLectures(data.data.filter(l => 
            l.department.toLowerCase() === (student?.course)?.toLowerCase()
        ));
      }
    } catch (err) {
      console.error("Lecture Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Modern Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Digital <span className="text-indigo-600">Learning</span> Hub
           </h1>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                {studentInfo?.course || "ITM"} • Authorized Session Archives
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-white flex items-center justify-center overflow-hidden">
                        <FiUser className="text-slate-300" />
                    </div>
                ))}
           </div>
           <div>
                <p className="text-[10px] font-black text-slate-900 leading-none">1.2K+ STUDENTS</p>
                <p className="text-[8px] font-bold text-slate-400">ACTIVELY STREAMING</p>
           </div>
        </div>
      </div>

      {lectures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {lectures.map((lecture) => (
            <LectureCard key={lecture._id} lecture={lecture} />
          ))}
        </div>
      ) : (
        !loading && (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-50/50">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-8">
                    <FiVideo size={48} className="text-slate-100" />
                </div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.5em] italic">No Published Sessions Found</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{studentInfo?.course} Registry Sync: Online</p>
            </div>
        )
      )}
    </div>
  );
};

export default OnlineClass;



