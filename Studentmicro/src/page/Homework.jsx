import React, { memo, useEffect, useState, useCallback } from "react";
import { WorkAPI } from "../api/apis";
import Loader from "../components/common/Loader.jsx";

const HomeworkCard = memo(({ item }) => {
  const dueDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div className="flex-1">
        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1 uppercase">
            {item?.subject || "Subject"}
        </h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Homework Task</p>

        <div className="space-y-1.5 mb-6 border-y border-slate-50 py-3">
            <div className="text-xs font-bold text-slate-600 flex justify-between">
               <span className="opacity-50">ACADEMIC YEAR:</span>
               <span>{item?.year || "N/A"}</span>
            </div>
            <div className="text-xs font-bold text-slate-600 flex justify-between">
               <span className="opacity-50">POST DATE:</span>
               <span>{dueDate}</span>
            </div>
        </div>

        <div className="space-y-4 mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Questions List</p>
            <div className="space-y-4">
               {item?.questions?.length > 0 ? (
                  item.questions.slice(0, 2).map((q, i) => (
                    <div key={i} className="flex gap-3">
                       <span className="text-blue-600 font-black text-sm shrink-0">{i + 1}.</span>
                       <p className="text-sm font-medium text-slate-700 leading-relaxed italic">{q}</p>
                    </div>
                  ))
               ) : (
                  <p className="text-sm text-slate-400 italic">No questions listed.</p>
               )}
            </div>
        </div>
      </div>
    </div>
  );
});

const Homework = () => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen space-y-8 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">📚 Daily Homework</h2>
        <p className="text-sm text-slate-500 font-medium">Complete all assigned questions for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {homeworkData?.filter(item => item && item.subject).map(item => (
          <HomeworkCard key={item._id} item={item} />
        ))}
      </div>

      {homeworkData.length === 0 && !loading && (
           <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm col-span-full">
              <div className="w-16 h-1 w-slate-50 bg-slate-50 rounded-full mx-auto mb-4"></div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No homework found.</p>
           </div>
      )}
    </div>
  );
};

export default Homework;