import React, { useState, useEffect, useCallback } from "react";
import { ReportAPI, AcademicAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

const Exams = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);

  // Registry States
  const [courses, setCourses] = useState([]);
  const [semestersList, setSemestersList] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [newExam, setNewExam] = useState({
    department: "",
    semester: "",
    subject: "",
    examType: "",
    examDate: "",
    examTime: "",
    room: "",
    ct: "",
  });

  const fetchRegistries = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        AcademicAPI.get("/courses"),
        AcademicAPI.get("/semesters")
      ]);
      if (cRes.data.courses) setCourses(cRes.data.courses);
      if (sRes.data.semesters) setSemestersList(sRes.data.semesters);
    } catch (err) {
      console.error("Exam Registry Sync Failed", err);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    if (!newExam.department || !newExam.semester) {
        setSubjects([]);
        return;
    }
    try {
        const { data } = await AcademicAPI.get("/subjects", {
            params: {
                department: newExam.department,
                semester: newExam.semester
            }
        });
        if (data.subjects) {
            setSubjects(data.subjects);
        }
    } catch (err) {
        console.error("Failed to fetch subjects", err);
    }
  }, [newExam.department, newExam.semester]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
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

  const handleAddExam = async (e) => {
    e.preventDefault();

    if (
      !newExam.department ||
      !newExam.semester ||
      !newExam.subject ||
      !newExam.examType ||
      !newExam.examDate ||
      !newExam.examTime ||
      !newExam.room ||
      !newExam.ct
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
        setLoading(true);
        const payload = {
            Department: newExam.department,
            Semester: newExam.semester,
            Subject: newExam.subject,
            ExamType: newExam.examType,
            Date: newExam.examDate,
            time: newExam.examTime,
            RoomNo: newExam.room,
            ct: Number(newExam.ct)
        };

        const { data } = await ReportAPI.post("/Exam-Schedule/uploader", payload);
        toast.success(data?.message || "Exam Added Successfully!");
        
        fetchExams(); // Refresh list
        setNewExam({
          department: "",
          semester: "",
          subject: "",
          examType: "",
          examDate: "",
          examTime: "",
          room: "",
          ct: "",
        });
        setShowForm(false);
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add exam");
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
    <div className="min-h-screen bg-white pt-24 p-3 sm:p-6 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
            <Loader />
        </div>
      )}

      <div className="w-full bg-white rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">

        {/* HEADER */}
        <div className="border-b border-slate-50 px-8 py-8 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Sessional Exam Architect</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Configure Institutional Examination Protocols</p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all shadow-lg active:scale-95 ${showForm ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-indigo-600'}`}
          >
            {showForm ? "DISCARD" : "REGISTER EXAM"}
          </button>
        </div>

        {/* Add Exam Form */}
        {showForm && (
          <form
            className="px-8 py-8 border-b border-indigo-50 bg-white border border-slate-100/20 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-top duration-500"
            onSubmit={handleAddExam}
          >
            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Department</label>
                <select
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
                  value={newExam.department}
                  onChange={(e) =>
                    setNewExam({ ...newExam, department: e.target.value, subject: "" })
                  }
                >
                  <option value="">Select Path</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Semester</label>
                <select
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
                  value={newExam.semester}
                  onChange={(e) =>
                    setNewExam({ ...newExam, semester: e.target.value, subject: "" })
                  }
                >
                  <option value="">Select Stage</option>
                  {semestersList.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Subject Title</label>
                <select
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
                  value={newExam.subject}
                  disabled={!newExam.department || !newExam.semester}
                  onChange={(e) =>
                    setNewExam({ ...newExam, subject: e.target.value })
                  }
                >
                  <option value="">{subjects.length > 0 ? "CHOOSE SUBJECT" : "NO SUBJECTS FOUND"}</option>
                  {subjects.map(s => <option key={s._id} value={s.name}>{s.name.toUpperCase()} ({s.code})</option>)}
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Exam Format</label>
                <select
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
                  value={newExam.examType}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examType: e.target.value })
                  }
                >
                  <option value="">Format</option>
                  <option value="Theory">Theory/Written</option>
                  <option value="Practical">Laboratory/Viva</option>
                </select>
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Target Date</label>
                <input
                  type="date"
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                  value={newExam.examDate}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examDate: e.target.value })
                  }
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Slot Window</label>
                <input
                  type="text"
                  placeholder="10:00 AM - 01:00 PM"
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                  value={newExam.examTime}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examTime: e.target.value })
                  }
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Assigned Room</label>
                <input
                  type="text"
                  placeholder="E.G. ROOM 204"
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                  value={newExam.room}
                  onChange={(e) =>
                    setNewExam({ ...newExam, room: e.target.value })
                  }
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Evaluation Cycle (CT)</label>
                <select
                  className="w-full bg-white  rounded-[10px] px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm cursor-pointer"
                  value={newExam.ct}
                  onChange={(e) =>
                    setNewExam({ ...newExam, ct: e.target.value })
                  }
                >
                  <option value="">Select Cycle</option>
                  <option value="1">Sessional 01</option>
                  <option value="2">Sessional 02</option>
                  <option value="3">Sessional 03</option>
                </select>
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full bg-slate-900 border border-slate-800 text-white px-8 py-3.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:border-emerald-700 transition-all active:scale-95"
              >
                COMMIT TO SCHEDULE
              </button>
            </div>
          </form>
        )}

        {/* FILTER */}
        <div className="px-8 py-6 border-b border-slate-50 bg-white/10">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="bg-white border border-slate-200 rounded-[10px] px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 outline-none focus:ring-4 focus:ring-slate-50 cursor-pointer shadow-sm"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSemester("");
              }}
            >
              <option value="">Filter: Department</option>
              {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
            </select>

            <select
              className="bg-white border border-slate-200 rounded-[10px] px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 outline-none focus:ring-4 focus:ring-slate-50 disabled:opacity-50 cursor-pointer shadow-sm"
              value={semester}
              disabled={!department}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Filter: Semester</option>
              {semestersList.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="relative w-full overflow-x-auto scroller-style">
          <table className="min-w-[1000px] w-full text-sm border-collapse">
            <thead className="bg-white sticky top-0">
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Subject Protocol</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Format</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Temporal Log</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Time-Slot</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Asset/Room</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Cycle</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest italic">System Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredExams.length ? (
                filteredExams.map((exam) => (
                  <tr key={exam._id || exam.id} className="hover:bg-white/50 transition-colors group">
                    <td className="px-8 py-6">
                        <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight italic">{exam.Subject}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{exam.Department} • {exam.Semester}</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                        <span className="px-3 py-1 bg-white text-slate-600 rounded-[10px] text-[9px] font-black uppercase tracking-widest">
                            {exam.ExamType}
                        </span>
                    </td>
                    <td className="px-6 py-6 text-center text-[11px] font-black text-slate-700 italic uppercase">
                        {exam.Date}
                    </td>
                    <td className="px-6 py-6 text-center text-[11px] font-black text-slate-500 uppercase tracking-tighter">
                        {exam.time}
                    </td>
                    <td className="px-6 py-6 text-center">
                         <p className="px-3 py-1 bg-white border border-slate-100 text-indigo-700 rounded-[10px] text-[9px] font-black uppercase tracking-tighter inline-block italic border border-slate-100">
                            {exam.RoomNo || exam.room}
                        </p>
                    </td>
                    <td className="px-6 py-6 text-center">
                         <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black mx-auto shadow-lg shadow-slate-200">
                            {exam.ct}
                         </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDelete(exam._id || exam.id)}
                        className="bg-slate-900 text-white px-5 py-2 rounded-[10px] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-xl shadow-slate-200"
                      >
                        PURGE
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-32 text-center text-slate-300 flex flex-col items-center justify-center gap-4 bg-white"
                  >
                    <div className="w-16 h-1 bg-white rounded-full mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-loose">No examination protocols indexed <br/> for this selection</p>
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



