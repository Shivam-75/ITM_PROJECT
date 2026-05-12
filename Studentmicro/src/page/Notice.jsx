import React, { memo, useState, useEffect, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";
import { FiBell, FiArrowRight, FiCalendar, FiUser, FiInfo } from "react-icons/fi";

const NoticeCard = memo(({ notice }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group flex flex-col justify-between h-full min-h-[320px]">
      <div>
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <FiBell size={22} />
            </div>
            <div className="px-3 py-1 bg-gray-50 rounded-full border border-slate-100 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">New</p>
            </div>
        </div>

        <h3 className="text-xl font-black text-black tracking-tight mb-2 leading-tight group-hover:text-black/70 transition-colors">
            {notice?.title || "Special Notice"}
        </h3>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-4">
           {notice?.subject || "Announcement"}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-slate-100/50">
               <div className="flex items-center gap-2 mb-1">
                  <FiCalendar size={10} className="text-gray-400" />
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Date</p>
               </div>
               <p className="text-xs font-black text-black">{new Date(notice?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-slate-100/50">
               <div className="flex items-center gap-2 mb-1">
                  <FiUser size={10} className="text-gray-400" />
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Audience</p>
               </div>
               <p className="text-xs font-black text-black">{notice?.className || "All"}</p>
            </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl text-[12px] text-gray-600 leading-relaxed border border-slate-100">
           {notice?.description}
        </div>
      </div>
    </div>
  );
});

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await WorkAPI.get("/Notice/getNoticeDpt", { withCredentials: true });
      if (Array.isArray(data?.data)) {
        setNotices(data.data);
      } else {
        setNotices([]);
      }
    } catch (error) {
      console.error("Notice fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="max-w-[1400px] mx-auto min-h-screen space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-1 bg-black rounded-full"></div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Bulletin</p>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter">Academic <br /><span className="text-gray-200">Notices.</span></h2>
          <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">Official announcements and critical updates from the ITM Faculty Administration.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-full border border-slate-100">
           <FiInfo className="text-black" />
           <p className="text-[10px] font-black uppercase tracking-widest text-black">Registry Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6">
        {notices.map((notice, index) => (
          <NoticeCard key={notice._id || index} notice={notice} />
        ))}
      </div>

      {notices.length === 0 && !loading && (
        <div className="py-32 text-center bg-gray-50 rounded-[3rem] border border-slate-100 mx-6">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">No Active Announcements</p>
        </div>
      )}
    </div>
  );
};

export default Notice;
