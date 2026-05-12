import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiLayers, FiSearch, FiUser, FiAward, FiBookOpen, FiCheckCircle, FiTrash2, FiSend, FiX, FiFileText, FiBook, FiSmartphone } from "react-icons/fi";
import { ReportAPI, AcademicAPI } from "../../api/apis";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toststyle = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

export default function FacResult() {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [student, setStudent] = useState({
    name: "",
    roll: "",
    course: "",
    semester: "",
    section: "",
    year: "2026-27"
  });

  const [entries, setEntries] = useState([{ subject: "", marks: "" }]);
  const [studentList, setStudentList] = useState([]);
  const [viewResults, setViewResults] = useState([]);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchRoll, setSearchRoll] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);

  // Registry data
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const [cRes, yRes, sRes, secRes] = await Promise.all([
          AcademicAPI.get("/courses"),
          AcademicAPI.get("/years"),
          AcademicAPI.get("/semesters"),
          AcademicAPI.get("/sections")
        ]);
        setCourses(cRes.data.courses || cRes.data.data || []);
        setYears(yRes.data.years || yRes.data.data || []);
        setSemesters(sRes.data.semesters || sRes.data.data || []);
        setSections(secRes.data.sections || secRes.data.data || []);
      } catch (err) {
        console.error("Registry fetch failed", err);
      }
    };
    fetchRegistry();
  }, []);

  const fetchSubjects = useCallback(async () => {
    if (!student.course || !student.semester) {
        setSubjects([]);
        return;
    }
    try {
        const { data } = await AcademicAPI.get("/subjects", {
            params: {
                department: student.course,
                semester: student.semester
            }
        });
        if (data.subjects) {
            setSubjects(data.subjects);
        }
    } catch (err) {
        console.error("Failed to fetch subjects", err);
    }
  }, [student.course, student.semester]);

  useEffect(() => {
    fetchSubjects();
    // Reset entries subject when filters change to avoid stale data
    setEntries([{ subject: "", marks: "" }]);
  }, [fetchSubjects]);

  const fetchStudents = useCallback(async () => {
    try {
      const c = student.course?.trim();
      const s = student.semester?.trim();
      const sec = student.section?.trim();
      if (!c && !s && !sec) {
        setStudentList([]);
        return;
      }
      const queryParams = new URLSearchParams();
      if (c) queryParams.append("course", c);
      if (s) queryParams.append("semester", s);
      if (sec) queryParams.append("section", sec);
      if (student.year) queryParams.append("year", student.year);

      const authBase = import.meta.env.VITE_BASE_Auth;
      const { data } = await axios.get(`${authBase}/student-list?${queryParams.toString()}`, { withCredentials: true });
      setStudentList(Array.isArray(data?.studentList) ? data.studentList : []);
    } catch (err) {
      setStudentList([]);
    }
  }, [student.course, student.semester, student.section, student.year]);

  useEffect(() => {
    if (!viewMode) fetchStudents();
  }, [fetchStudents, viewMode]);

  const fetchResults = async (manual = false) => {
    if (!student.course || !student.semester || !student.section) {
        if (manual && viewMode) toast.error("SELECT FILTERS FIRST", toststyle);
        return;
    }
    try {
        setFetchingResults(true);
        const { data } = await ReportAPI.get("/Mark/uploade", {
            params: {
                course: student.course,
                semester: student.semester,
                section: student.section,
                year: student.year
            }
        });
        setViewResults(data?.data || []);
    } catch (err) {
        setViewResults([]);
    } finally {
        setFetchingResults(false);
    }
  };

  useEffect(() => {
    if (viewMode) fetchResults(false);
  }, [viewMode, student.course, student.semester, student.section, student.year]);

  const addSubjectRow = () => setEntries([...entries, { subject: "", marks: "" }]);
  
  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    if (field === "marks") {
      const numericValue = parseInt(value, 10);
      if (numericValue > 10) value = "10";
      else if (numericValue < 0) value = "0";
    }
    updated[index][field] = value;
    setEntries(updated);
  };

  const deleteEntry = (index) => setEntries(entries.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!student.roll || !student.course || !student.semester || !student.section) {
        toast.error("IDENTIFICATION REQUIRED: All fields + Student selection needed.", toststyle);
        return;
    }
    if (entries.some(s => !s.subject.trim() || s.marks === "")) {
        toast.error("INVALID DATA: Please fill all subject/marks rows.", toststyle);
        return;
    }
    try {
        setLoading(true);
        await ReportAPI.post("/Mark/uploade", {
            userId: student.roll,
            course: student.course,
            year: student.year,
            section: student.section,
            semester: student.semester,
            entries
        });
        toast.success("MARKS BROADCASTED SUCCESSFULLY", toststyle);
        setEntries([{ subject: "", marks: "" }]);
        setStudent({ ...student, name: "", roll: "" });
    } catch (err) {
        toast.error(err.response?.data?.message || "TRANSMISSION FAILED", toststyle);
    } finally {
        setLoading(false);
    }
  };

  const deleteMarkRecord = async () => {
    if (!deletingId) return;
    try {
        setLoading(true);
        await ReportAPI.delete(`/Mark/delete/${deletingId}`);
        toast.success("RECORD TERMINATED", toststyle);
        setShowDeleteModal(false);
        setDeletingId(null);
        fetchResults(false);
    } catch (err) {
        toast.error("DELETION FAILED", toststyle);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchRoll) return;
    try {
        setSearching(true);
        const { data } = await ReportAPI.get("/Mark/uploade", {
            params: { userId: searchRoll }
        });
        if (data?.data?.[0]) setSearchResult(data.data[0]);
        else toast.error("NO TRANSCRIPT FOUND FOR THIS ID", toststyle);
    } catch (err) {
        toast.error("TRANSCRIPT SEARCH FAILED", toststyle);
    } finally {
        setSearching(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-pink-50 pt-6 px-4 md:px-8 pb-32 font-sans">
      <ToastContainer />
      
      {/* Header */}
      <div className="max-w-[1400px] mx-auto mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        {viewMode ? "Result Archive" : "Sessional Mark"}
                    </h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Protocol: {viewMode ? "Data Retrieval" : "Data Intake"}</p>
                  </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <button 
                    onClick={() => setViewMode(!viewMode)} 
                    className={`px-8 py-4 rounded-[10px] text-[11px] font-black uppercase tracking-widest italic transition-all flex items-center gap-3 shadow-xl ${viewMode ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 border border-slate-100 hover:bg-white border border-slate-100'}`}
                  >
                      {viewMode ? <FiPlus /> : <FiLayers />}
                      {viewMode ? "New Entry" : "View Records"}
                  </button>

                  <div className="relative flex-1 min-w-[250px]">
                      <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
                        placeholder="SEARCH BY ROLL ID" 
                        value={searchRoll}
                        onChange={(e) => setSearchRoll(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                  </div>
                  <button onClick={handleSearch} disabled={searching} className="p-4 bg-slate-900 text-white rounded-[10px] shadow-xl hover:bg-indigo-600 transition-all disabled:opacity-50">
                      {searching ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FiSearch size={20} />}
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Academic Filter Bar */}
            <div className="lg:col-span-12 bg-white p-6 rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100  rounded-[10px] text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-sm" value={student.course} onChange={(e) => setStudent({ ...student, course: e.target.value })}>
                            <option value="">CHOOSE DEPARTMENT</option>
                            {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100  rounded-[10px] text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-sm" value={student.year} onChange={(e) => setStudent({ ...student, year: e.target.value })}>
                            <option value="">ACADEMIC YEAR</option>
                            {years.map(y => <option key={y._id} value={y.name}>{y.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100  rounded-[10px] text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-sm" value={student.semester} onChange={(e) => setStudent({ ...student, semester: e.target.value })}>
                            <option value="">SEMESTER</option>
                            {semesters.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <FiCheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100  rounded-[10px] text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-sm" value={student.section} onChange={(e) => setStudent({ ...student, section: e.target.value })}>
                            <option value="">SECTION</option>
                            {sections.map(sec => <option key={sec._id} value={sec.name}>{sec.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {searchResult && (
                <div className="lg:col-span-12 bg-indigo-900 p-8 rounded-[10px] text-white relative overflow-hidden shadow-2xl">
                    <button onClick={() => setSearchResult(null)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-all"><FiX size={24} /></button>
                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-8 mb-8">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black italic tracking-tighter">Transcript: {searchResult.userId}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-300 opacity-80">{searchResult.course} • {searchResult.semester} • {searchResult.year}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResult.entries.map((ent, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[10px] border border-white/10 flex justify-between items-center">
                                <span className="text-[12px] font-black uppercase italic text-indigo-100">{ent.subject}</span>
                                <span className="text-xl font-black italic text-white">{ent.marks}/10</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {viewMode ? (
                /* Archive Table */
                <div className="lg:col-span-12 bg-white rounded-[10px] border border-slate-100 shadow-2xl shadow-slate-100/50 p-8 min-h-[600px]">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic flex items-center gap-3">
                            <FiLayers className="text-indigo-600" /> Upload Archive
                        </h2>
                        <button onClick={() => fetchResults(true)} className="px-6 py-2.5 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase italic shadow-lg">Refresh Sync</button>
                    </div>

                    {viewResults.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-4">
                                <thead>
                                    <tr className="text-left">
                                        <th className="px-6 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Identity</th>
                                        <th className="px-6 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Marks Transcript</th>
                                        <th className="px-6 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewResults.map((res) => (
                                        <tr key={res._id} className="bg-white border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                            <td className="px-6 py-6 rounded-l-2xl border-y border-l border-slate-100">
                                                <span className="text-[13px] font-black text-slate-900 font-mono italic">{res.userId}</span>
                                            </td>
                                            <td className="px-6 py-6 border-y border-slate-100">
                                                <div className="flex flex-wrap gap-2">
                                                    {res.entries.map((ent, i) => (
                                                        <div key={i} className="px-3 py-1.5 bg-white rounded-[10px] border border-slate-100 text-[10px] font-black flex items-center gap-2">
                                                            <span className="text-slate-400 uppercase">{ent.subject}</span>
                                                            <div className="w-[1px] h-3 bg-slate-100"></div>
                                                            <span className="text-indigo-600">{ent.marks}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 rounded-r-2xl border-y border-r border-slate-100 text-center">
                                                <button onClick={() => { setDeletingId(res._id); setShowDeleteModal(true); }} className="p-3 text-rose-500 hover:bg-rose-50 rounded-[10px] transition-all">
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-32 text-center">
                            <FiFileText size={60} className="mx-auto text-slate-100 mb-6" />
                            <h3 className="text-xl font-black text-slate-900 italic tracking-tighter">No Transcripts Archived</h3>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Pick filters above to fetch results.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Entry Protocol */
                <>
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/30">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-8">Identity Sync</h2>
                        <div className="space-y-4">
                            <div className="relative">
                                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <select 
                                    className="w-full pl-14 pr-4 py-4.5 bg-white border border-slate-100  rounded-[10px] text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 shadow-sm appearance-none cursor-pointer"
                                    value={student.roll}
                                    onChange={(e) => {
                                        const selected = studentList.find(s => s.studentId === e.target.value);
                                        setStudent({ ...student, roll: e.target.value, name: selected ? selected.name : "" });
                                    }}
                                >
                                    <option value="">{studentList.length > 0 ? "CHOOSE STUDENT" : "NO STUDENTS FOUND"}</option>
                                    {studentList.map(s => <option key={s._id} value={s.studentId}>{s.name.toUpperCase()} ({s.studentId})</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <FiSmartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input className="w-full pl-14 pr-4 py-4.5 bg-white border border-slate-100  rounded-[10px] text-[12px] font-black uppercase italic shadow-sm" value={student.roll} readOnly placeholder="USER ID AUTO-SYNC" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[10px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white border border-slate-1000/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 italic">Verification Protocol</p>
                        <h4 className="text-xl font-black italic tracking-tighter truncate">{student.name || "UNIDENTIFIED"}</h4>
                        <p className="text-[11px] font-mono font-black text-indigo-400 tracking-widest">{student.roll || "UID-XXXXXX"}</p>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white p-8 rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/30 min-h-[500px]">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Subject Intake</h2>
                        <button onClick={addSubjectRow} className="px-6 py-3 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase italic shadow-lg flex items-center gap-2 hover:bg-indigo-600 transition-all">
                            <FiPlus /> Add Row
                        </button>
                    </div>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {entries.map((s, i) => (
                            <div key={i} className="flex gap-4 items-center bg-white border border-slate-100/50 p-4 rounded-[10px] border border-slate-100 animate-in slide-in-from-right-4 duration-300">
                                <div className="flex-[3] relative">
                                    <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <select 
                                        className="w-full pl-14 pr-4 py-4 bg-white  rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 shadow-sm cursor-pointer appearance-none" 
                                        value={s.subject} 
                                        disabled={!student.course || !student.semester}
                                        onChange={(e) => handleEntryChange(i, "subject", e.target.value)}
                                    >
                                        <option value="">{subjects.length > 0 ? "CHOOSE SUBJECT" : "NO SUBJECTS FOUND"}</option>
                                        {subjects.map(sub => <option key={sub._id} value={sub.name}>{sub.name.toUpperCase()} ({sub.code})</option>)}
                                    </select>
                                </div>
                                <div className="flex-[1] relative">
                                    <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="number" min="0" max="10" className="w-full pl-14 pr-4 py-4 bg-white  rounded-[10px] text-[13px] font-black text-indigo-600 text-center italic shadow-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="0.0" value={s.marks} onChange={(e) => handleEntryChange(i, "marks", e.target.value)} />
                                </div>
                                <button onClick={() => deleteEntry(i)} className="p-4 text-rose-500 hover:bg-rose-50 rounded-[10px] transition-all"><FiTrash2 size={20} /></button>
                            </div>
                        ))}
                    </div>

                    {entries.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-50">
                            <button disabled={loading} onClick={handleSubmit} className="w-full py-5 bg-slate-900 text-white rounded-[10px] text-[13px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4">
                                <FiSend />
                                {loading ? "BROADCASTING..." : "COMMIT TRANSCRIPT"}
                            </button>
                        </div>
                    )}
                </div>
                </>
            )}
        </div>
      </div>

      {/* Global Loader */}
      {loading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[1000] flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic animate-pulse">Processing Protocol...</p>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-md rounded-[10px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-8 text-center">
                      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FiTrash2 size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-2">Terminate Record?</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          This action is irreversible. The student's sessional transcript will be purged from the archive.
                      </p>
                  </div>
                  <div className="grid grid-cols-2 border-t border-slate-50">
                      <button 
                        onClick={() => { setShowDeleteModal(false); setDeletingId(null); }}
                        className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white border border-slate-100 transition-all border-r border-slate-50"
                      >
                          Abort
                      </button>
                      <button 
                        onClick={deleteMarkRecord}
                        className="py-6 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
                      >
                          Confirm Purge
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
