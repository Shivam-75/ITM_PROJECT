import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ReportAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const Exams = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Registry States
  const [courses, setCourses] = useState([]);
  const [semestersList, setSemestersList] = useState([]);

  const fetchRegistries = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true })
      ]);
      if (cRes.data.data) setCourses(cRes.data.data);
      if (sRes.data.data) setSemestersList(sRes.data.data);
    } catch (err) {
      console.error("Exam Registry Sync Failed", err);
    }
  }, []);

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await ReportAPI.get("/Exam-Schedule/uploader");
      if (data?.data) {
        setExamData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch exams", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistries();
    fetchExams();
  }, [fetchRegistries, fetchExams]);

  // 🔹 Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?"))
      return;

    try {
      setLoading(true);
      await ReportAPI.delete(`/Exam-Schedule/deleted/${id}`);
      toast.success("Exam schedule deleted successfully");
      setExamData((prev) => prev.filter((exam) => (exam._id || exam.id) !== id));
    } catch (err) {
      toast.error("Failed to delete exam schedule");
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = examData.filter(
    (e) =>
      (!department || e.Department === department) &&
      (!semester || e.Semester === semester)
  );

  return (
    <div className="min-h-screen bg-transparent p-3 sm:p-6 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
            <Loader />
        </div>
      )}
      
      <div className="w-full bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">

        {/* HEADER */}
        <div className="border-b border-slate-50 px-8 py-8 flex items-center gap-4">
             <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
             <div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Academic Examination Schedules</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Centralized Sessional Master Registry
                </p>
             </div>
        </div>

        {/* FILTER */}
        <div className="px-8 py-6 border-b border-slate-50 bg-white/30">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="bg-white border-2 border-slate-100 rounded-lg px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all cursor-pointer shadow-sm"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSemester("");
              }}
            >
              <option value="">Filter By Department</option>
              {courses.map(c => <option key={c._id || c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
            </select>

            <select
              className="bg-white border-2 border-slate-100 rounded-lg px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              value={semester}
              disabled={!department}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semestersList.map(s => <option key={s._id || s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative w-full overflow-x-auto scroller-style">
          <table className="min-w-[1000px] w-full text-sm border-collapse">
            <thead className="bg-white sticky top-0">
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject Protocol</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Format</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Temporal Log</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Time-Slot</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset/Room</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">System Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredExams.length ? (
                filteredExams.map((exam) => (
                  <tr
                    key={exam._id || exam.id}
                    className="hover:bg-white/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{exam.Subject}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{exam.Department} • SEM {exam.Semester}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-white text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {exam.ExamType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <p className="text-[11px] font-black text-slate-700 italic uppercase">{exam.Date}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <p className="text-[11px] font-black text-slate-500 uppercase">{exam.time}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <p className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-tighter inline-block italic">
                        {exam.RoomNo || exam.room}
                       </p>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(exam._id || exam.id)}
                        className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg shadow-slate-200"
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-32 text-center text-slate-300 flex flex-col items-center justify-center gap-4 bg-white"
                  >
                    <div className="w-16 h-1 bg-white rounded-full mx-auto mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">No examination protocols indexed</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Exams;




