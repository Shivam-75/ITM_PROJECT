import React, { memo, useState, useEffect, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";

const AssignmentCard = memo(({ item }) => {
  const dueDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div className="flex-1">
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1 uppercase">
            {item?.subject || "Subject"}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Academic Project</p>

        <div className="space-y-2 mb-6 border-b border-slate-50 pb-4">
            <div className="text-xs font-bold text-slate-600 flex justify-between">
               <span className="opacity-40 uppercase tracking-tighter">Academic Year:</span>
               <span>{item?.year || "N/A"}</span>
            </div>
            <div className="text-xs font-bold text-slate-600 flex justify-between">
               <span className="opacity-40 uppercase tracking-tighter">Target Submission:</span>
               <span className="text-rose-600 italic font-black">{dueDate}</span>
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 underline underline-offset-4">Full Assignment Details</p>
            <div className="space-y-5">
               {item?.questions?.length > 0 ? (
                  item.questions.slice(0, 5).map((q, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                       <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                          {i + 1}
                       </span>
                       <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">
                         {q}
                       </p>
                    </div>
                  ))
               ) : (
                  <p className="text-sm text-slate-400 italic">No specific objectives registered.</p>
               )}
            </div>
        </div>
      </div>
    </div>
  );
});

const Assignment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen space-y-10 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">📝 Final Assignments</h2>
        <p className="text-sm text-slate-500 font-medium">Clear all remaining project objectives for evaluation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.filter((item) => item && item.subject).map((item, index) => (
          <AssignmentCard key={item._id || index} item={item} />
        ))}
      </div>

      {data.length === 0 && !loading && (
        <div className="py-20 text-center bg-white rounded-lg border border-slate-100 shadow-sm col-span-full">
           <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No assignments found for your course.</p>
        </div>
      )}
    </div>
  );
};

export default Assignment;



