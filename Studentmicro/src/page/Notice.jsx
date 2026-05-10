import React, { memo, useState, useEffect, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";

const NoticeCard = memo(({ notice }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow h-full min-h-[280px]">
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight line-clamp-1">
                {notice?.title || "Special Notice"}
            </h3>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">{notice?.subject || "Announcement"}</p>

        <div className="space-y-1.5 mb-4 border-y border-slate-50 py-3">
            <div className="text-[10px] font-bold text-slate-500 flex justify-between">
               <span className="uppercase tracking-widest opacity-60">Date:</span>
               <span className="text-slate-900">{new Date(notice?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-500 flex justify-between">
               <span className="uppercase tracking-widest opacity-60">Recipient:</span>
               <span className="text-slate-900">{notice?.className || "All"}</span>
            </div>
        </div>

        <div className="p-3 bg-white rounded-lg text-[11px] text-slate-600 leading-relaxed italic border border-slate-100">
           "{notice?.description}"
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
    <div className="min-h-screen space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div>
        <h2 className="text-xl font-black text-slate-900">📢 Notices</h2>
        <p className="text-xs text-slate-400 font-medium tracking-tight">Stay updated with ITM announcements.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
        {notices.map((notice, index) => (
          <NoticeCard key={notice._id || index} notice={notice} />
        ))}
      </div>

      {notices.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-lg border border-slate-100 shadow-sm col-span-full">
           <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">No active notices.</p>
        </div>
      )}
    </div>
  );
};

export default Notice;



