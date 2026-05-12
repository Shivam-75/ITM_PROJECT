import React, { useCallback, useEffect, useState, useMemo } from "react";
import { WorkAPI, AcademicAPI } from "../../api/apis";
import Loader from "../../common/Loader";
import { toast } from "react-toastify";
import useAuth from "../../../store/FacultyStore";
import { 
  FiPlus, FiLayers, FiCalendar, FiBook, 
  FiTrash2, FiEdit, FiCheckCircle, FiFileText, FiSend, FiX
} from "react-icons/fi";

const emptyState = {
  department: "",
  year: "",
  semester: "",
  section: "",
  subject: "",
  questions: [""],
  submissionDate: ""
};

const HomeworkManagement = () => {
  const [activeView, setActiveView] = useState("show");
  const [homeworks, setHomeworks] = useState([]);
  const [formData, setFormData] = useState(emptyState);
  const [loading, setLoading] = useState(false);
  const { toststyle } = useAuth();

  // Registry States
  const [courses, setCourses] = useState([]);
  const [yearsList, setYearsList] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const fetchRegistries = useCallback(async () => {
    try {
      const [cRes, yRes, semRes, secRes, subRes] = await Promise.all([
        AcademicAPI.get("/courses"),
        AcademicAPI.get("/years"),
        AcademicAPI.get("/semesters"),
        AcademicAPI.get("/sections"),
        AcademicAPI.get("/subjects")
      ]);
      if (cRes.data.data) setCourses(cRes.data.data);
      if (yRes.data.data) setYearsList(yRes.data.data);
      if (semRes.data.data) setSemesters(semRes.data.data);
      if (secRes.data.data) setSections(secRes.data.data);
      if (subRes.data.subjects) setSubjectsList(subRes.data.subjects);
    } catch (err) {
      console.error("Homework Registry Sync Failed", err);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredSubjects = useMemo(() => {
    if (!formData.department || !formData.semester) return [];
    return subjectsList.filter(s => 
      s.department?.toLowerCase() === formData.department?.toLowerCase() &&
      s.semester?.toLowerCase() === formData.semester?.toLowerCase()
    );
  }, [formData.department, formData.semester, subjectsList]);

  const handleQuestionChange = (index, value) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, ""]
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validQuestions = formData.questions.filter(q => q.trim() !== "");

    if (!formData.department || !formData.year || !formData.semester || !formData.section || !formData.subject || validQuestions.length === 0) {
      toast.error("Please fill all mandatory fields properly.", { theme: "colored" });
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData, questions: validQuestions }; // Removed Number() casting
      const { data } = await WorkAPI.post("/Homework/uploader", payload, { withCredentials: true });

      setHomeworks((prev) => [data?.homworkFind || payload, ...prev]);
      setFormData(emptyState);
      setActiveView("show");
      toast.success(data?.message || "Homework Architected Successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Synthesis Failed");
    } finally {
      setLoading(false);
    }
  };

  const getHomeWork = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await WorkAPI.get("/Homework/uploader", { withCredentials: true });
      setHomeworks(data?.HomeworkData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHomeWork();
    fetchRegistries();
  }, [getHomeWork, fetchRegistries]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    try {
      setLoading(true);
      await WorkAPI.delete(`/Homework/Delete/${id}`, { withCredentials: true });
      setHomeworks((prev) => prev.filter((hw) => hw._id !== id));
      toast.success("Record Purged Successfully");
    } catch (err) {
      toast.error("Purge Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Simplified Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                Homework Management
              </h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-[10px] border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setActiveView("create")}
                  className={`px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'create' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Create
                </button>
                <button 
                  onClick={() => setActiveView("show")}
                  className={`px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'show' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Manage
                </button>
          </div>
      </div>

      {/* CREATE VIEW */}
      {activeView === "create" && (
        <div className="bg-white rounded-[10px] md:rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10 group overflow-hidden relative">
           <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Department</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer">
                            <option value="">Select Path</option>
                            {courses.map(c => <option key={c._id || c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Year</label>
                        <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer">
                            <option value="">Select Stage</option>
                            {yearsList.map(y => <option key={y._id || y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Semester</label>
                        <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer">
                            <option value="">Select Phase</option>
                            {semesters.map(s => <option key={s._id || s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Section</label>
                        <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer">
                            <option value="">Select Local</option>
                            {sections.map(sec => <option key={sec._id || sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Assignment Subject</label>
                        <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer">
                            <option value="">Select Subject</option>
                            {filteredSubjects.map(sub => <option key={sub._id} value={sub.name}>{sub.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Submission Deadline</label>
                        <input type="date" name="submissionDate" value={formData.submissionDate} onChange={handleChange} className="w-full px-5 py-3.5 bg-white  rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer" />
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-black text-slate-900 uppercase italic tracking-widest">Question Repository</h3>
                        <button type="button" onClick={handleAddQuestion} className="px-5 py-2.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200">Add Question</button>
                    </div>

                    <div className="space-y-4">
                        {formData.questions.map((q, index) => (
                            <div key={index} className="flex gap-4 group animate-in slide-in-from-left-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black italic text-[10px]">{index + 1}</span>
                                    <textarea 
                                        value={q} 
                                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                                        placeholder="Enter problem statement..."
                                        rows={1}
                                        className="w-full pl-12 pr-6 py-3 bg-white  rounded-[10px] text-[11px] font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm resize-none"
                                    />
                                </div>
                                {formData.questions.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveQuestion(index)} className="p-3.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all h-fit mt-0.5">
                                        <FiX size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="px-12 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 w-fit"
                    >
                        <FiSend size={14} />
                        {loading ? "Syncing..." : "Submit"}
                    </button>
                </div>
           </form>
        </div>
      )}

      {/* MANAGE VIEW */}
      {activeView === "show" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {homeworks.length === 0 ? (
                 <div className="col-span-full py-32 text-center bg-white rounded-[10px] border-4 border-dashed border-slate-50">
                    <FiFileText size={48} className="mx-auto text-slate-100 mb-6" />
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] italic">No Homework protocols indexed.</h3>
                 </div>
            ) : (
                homeworks.map((hw, index) => (
                   <div key={hw._id || index} className="bg-white rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/40 p-6 md:p-8 flex flex-col group transition-all duration-300">
                        <div className="flex justify-between items-start mb-1">
                            <div className="space-y-0.5">
                                <h2 className="text-2xl font-[900] text-[#1e293b] uppercase tracking-tight leading-none">
                                    {hw.subject}
                                </h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{hw.department} ARCHIVE</p>
                            </div>
                            <button 
                                onClick={() => handleDelete(hw._id)} 
                                className="p-2.5 bg-rose-50 text-rose-500 rounded-[10px] opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                            >
                                <FiTrash2 size={14} />
                            </button>
                        </div>

                        <div className="space-y-2 py-4">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                                <span className="text-[9px] font-[800] text-slate-400 uppercase tracking-widest">Year:</span>
                                <span className="text-[10px] font-black text-[#1e293b]">{hw.year}{hw.year === 1 ? 'st' : hw.year === 2 ? 'nd' : hw.year === 3 ? 'rd' : 'th'} Year</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                                <span className="text-[9px] font-[800] text-slate-400 uppercase tracking-widest">Local:</span>
                                <span className="text-[10px] font-black text-[#1e293b]">{hw.section}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                                <span className="text-[9px] font-[800] text-slate-400 uppercase tracking-widest">Target Submission:</span>
                                <span className="text-[10px] font-black text-rose-600 italic">
                                    {hw.submissionDate ? new Date(hw.submissionDate).toLocaleDateString('en-GB') : "Not Defined"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 space-y-4">
                            <div className="inline-block border-b-2 border-slate-100 pb-0.5">
                                <p className="text-[9px] font-[900] text-indigo-300 uppercase tracking-[0.2em]">Assignment Details</p>
                            </div>

                            <div className="space-y-3">
                                {hw.questions?.map((q, i) => (
                                    <div key={i} className="flex items-center gap-4 group/item">
                                        <div className="w-6 h-6 rounded-md bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                            <span className="text-indigo-600 font-black text-[9px]">{i + 1}</span>
                                        </div>
                                        <p className="text-[12px] font-[800] text-slate-700 leading-tight uppercase italic break-words">
                                            {q}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">ID: {hw._id?.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>
                   </div>
                ))
            )}
        </div>
      )}
    </div>
  );
};

export default HomeworkManagement;


