import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ReportAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import { FiX } from "react-icons/fi";

const Exams = () => {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Registry States
  const [courses, setCourses] = useState([]);
  const [semestersList, setSemestersList] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [subjectsRegistry, setSubjectsRegistry] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const fetchRegistries = useCallback(async () => {
    try {
      const [cRes, sRes, yRes, subRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/years", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/subjects", { withCredentials: true })
      ]);
      if (cRes.data.data) setCourses(cRes.data.data);
      if (sRes.data.data) setSemestersList(sRes.data.data);
      if (yRes.data.data) setYearsList(yRes.data.data);
      if (subRes.data.subjects) setSubjectsRegistry(subRes.data.subjects);
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

  // 🔹 Form States
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Department: "",
    Semester: "",
    ct: "",
    Subject: "",
    ExamType: "Sessional",
    Date: "",
    time: "",
    RoomNo: ""
  });

  // 🔹 Filter subjects based on form selection
  useEffect(() => {
    if (formData.Department && formData.Semester) {
        const filtered = subjectsRegistry.filter(s => 
            s.department?.toLowerCase() === formData.Department.toLowerCase() &&
            s.semester?.toLowerCase() === formData.Semester.toLowerCase()
        );
        setFilteredSubjects(filtered);
    } else {
        setFilteredSubjects([]);
    }
  }, [formData.Department, formData.Semester, subjectsRegistry]);

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ReportAPI.post("/Exam-Schedule/uploader", formData);
      toast.success("Exam Schedule Published!");
      setShowModal(false);
      fetchExams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish exam");
    } finally {
      setLoading(false);
    }
  };

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
      (!department || e.Department?.toLowerCase() === department.toLowerCase()) &&
      (!semester || e.Semester?.toLowerCase() === semester.toLowerCase())
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
        <div className="border-b border-slate-50 px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Academic Examination Schedules</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Centralized Sessional Master Registry
                    </p>
                </div>
             </div>
             <button 
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all"
             >
                + Publish Schedule
             </button>
        </div>

        {/* FILTER */}
        <div className="px-8 py-6 border-b border-slate-50 bg-white/30">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="bg-white border border-slate-100 rounded-lg px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all cursor-pointer shadow-sm"
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
              className="bg-white border border-slate-100 rounded-lg px-5 py-3 text-[10px] font-black uppercase tracking-widest w-full sm:w-64 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              value={semester}
              disabled={!department}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {semestersList.map(s => <option key={s._id || s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* UPLOAD MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <form onSubmit={handleAddExam}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">New Examination Protocol</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Master Schedule Indexing</p>
                  </div>
                  <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900">
                    <FiX size={24} />
                  </button>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 italic font-bold">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Department</label>
                    <select 
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black uppercase"
                        value={formData.Department}
                        onChange={e => setFormData({...formData, Department: e.target.value})}
                    >
                        <option value="">Select Department</option>
                        {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Semester</label>
                    <select 
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black uppercase"
                        value={formData.Semester}
                        onChange={e => setFormData({...formData, Semester: e.target.value})}
                    >
                        <option value="">Select Semester</option>
                        {semestersList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Academic Year (ct)</label>
                    <select 
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black uppercase"
                        value={formData.ct}
                        onChange={e => setFormData({...formData, ct: e.target.value})}
                    >
                        <option value="">Select Year</option>
                        {yearsList.map(y => <option key={y._id} value={y.name}>{y.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Subject Name</label>
                    <select 
                        required
                        disabled={!formData.Department || !formData.Semester}
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black uppercase disabled:opacity-50"
                        value={formData.Subject}
                        onChange={e => setFormData({...formData, Subject: e.target.value})}
                    >
                        <option value="">{(!formData.Department || !formData.Semester) ? "Select Dept & Sem First" : "Select Subject"}</option>
                        {filteredSubjects.map(s => <option key={s._id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Exam Type</label>
                    <select 
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black"
                        value={formData.ExamType}
                        onChange={e => setFormData({...formData, ExamType: e.target.value})}
                    >
                        <option value="Sessional">Sessional</option>
                        <option value="University">University</option>
                        <option value="Practical">Practical</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Examination Date</label>
                    <input 
                        required
                        type="date" 
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black"
                        value={formData.Date}
                        onChange={e => setFormData({...formData, Date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Time Slot</label>
                    <input 
                        required
                        type="text" 
                        placeholder="e.g. 10:00 AM - 1:00 PM"
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">Room / Venue</label>
                    <input 
                        required
                        type="text" 
                        placeholder="e.g. LH-01"
                        className="w-full px-4 py-3 bg-white border border-slate-100 border-none rounded-lg text-[11px] font-black"
                        value={formData.RoomNo}
                        onChange={e => setFormData({...formData, RoomNo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-slate-100 flex justify-end gap-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`px-8 py-3 ${loading ? 'bg-slate-400' : 'bg-slate-900'} text-white rounded-lg text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-slate-200 transition-all`}
                  >
                    {loading ? 'Wait...' : 'Index Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black text-indigo-600 uppercase bg-white border border-slate-100 px-2 py-0.5 rounded">{exam.Department}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase italic">{exam.Semester} • {exam.ct}</span>
                      </div>
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
                       <p className="px-3 py-1 bg-white border border-slate-100 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-tighter inline-block italic">
                        {exam.RoomNo || exam.room}
                       </p>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(exam._id || exam.id)}
                        className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all hover:bg-red-600 shadow-lg shadow-slate-200"
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




