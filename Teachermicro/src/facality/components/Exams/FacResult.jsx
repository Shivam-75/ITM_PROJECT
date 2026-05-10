import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ReportAPI } from "../../api/apis";
import useAuth from "../../../store/FacultyStore";
import { FiPlus, FiTrash2, FiSearch, FiX, FiUser, FiSmartphone, FiLayers, FiBookOpen, FiCalendar, FiCheckCircle, FiFileText } from "react-icons/fi";

export default function FacResult() {
  const { toststyle } = useAuth();
  const [searchRoll, setSearchRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [student, setStudent] = useState({
    name: "", roll: "", course: "", semester: "", section: "",
  });

  // Registry States
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, secRes, semRes] = await Promise.all([
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-courses", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-sections", { withCredentials: true }),
          axios.get("http://localhost:5002/api/v3/Admin/Academic/file-semesters", { withCredentials: true })
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (secRes.data.sections) setSections(secRes.data.sections);
        if (semRes.data.semesters) setSemesters(semRes.data.semesters);
      } catch (err) {
        console.error("Result Registry Sync Failed:", err);
      }
    };
    fetchRegistries();
  }, []);

  const [subjects, setSubjects] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const addSubjectRow = () => {
    setSubjects([...subjects, { subName: "", marks: "" }]);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const deleteSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const totalMarks = subjects.reduce((sum, s) => sum + (Number(s.marks) || 0), 0);
  const isPass = subjects.length > 0 && subjects.every((s) => Number(s.marks) >= 4);

  const handleSubmit = async () => {
    if (!student.name || !student.roll || !student.course || !student.semester || !student.section) {
        toast.error("IDENTIFICATION REQUIRED", toststyle);
        return;
    }
    if (subjects.length === 0 || subjects.some(s => !s.subName.trim() || s.marks === "")) {
        toast.error("INTAKE ERROR", toststyle);
        return;
    }

    try {
        setLoading(true);
        const { data } = await ReportAPI.post("/Mark/uploade", {
            name: student.name,
            rollNo: student.roll, // Removed Number() casting
            course: student.course,
            section: student.section,
            semester: student.semester, // Removed Number() casting
            subjects: subjects
        });
        toast.success(data?.message || "Success", toststyle);
        setStudent({ name: "", roll: "", course: "", semester: "", section: "" });
        setSubjects([]);
    } catch (err) {
        toast.error("Broadcast Failure", toststyle);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = async () => {
      if(!searchRoll.trim()) return;
      try {
          setSearching(true);
          const { data } = await ReportAPI.get("/Mark/uploade");
          const found = data?.data?.find(m => String(m.rollNo) === searchRoll.trim());
          if(found) {
              setSearchResult(found);
              setSearchRoll("");
          } else {
              toast.error("RECORD NOT FOUND", toststyle);
          }
      } catch (err) {
          toast.error("DATABASE ERROR", toststyle);
      } finally {
          setSearching(false);
      }
  };

  return (
    <div className="min-h-[100dvh] bg-white pt-4 px-4 md:px-8 pb-20">
      {/* ===== Responsive Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mb-8 md:mb-12 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="w-1.5 h-6 md:w-2 md:h-10 bg-indigo-600 rounded-full"></div>
              <h1 className="text-xl md:text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter">Sessional Mark</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                  <FiSearch className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    className="w-full md:w-80 pl-10 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-slate-50 border-none rounded-[1.2rem] md:rounded-[1.5rem] text-[10px] md:text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 shadow-inner font-mono"
                    placeholder="ENTER ROLL ID" 
                    value={searchRoll}
                    onChange={(e) => setSearchRoll(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
              </div>
              <button onClick={handleSearch} disabled={searching} className="p-3 md:p-5 bg-slate-900 text-white rounded-[1rem] md:rounded-[1.2rem] shadow-xl">
                  {searching ? "..." : <FiSearch size={18} className="md:hidden" /> || <FiSearch size={22} className="hidden md:block" />}
                  {!searching && <FiSearch className="md:w-[22px] md:h-[22px] w-[18px] h-[18px]" />}
              </button>
          </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
        
        {/* Search Result Dashboard */}
        {searchResult && (
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 animate-in zoom-in-95 duration-500 relative">
                <button onClick={() => setSearchResult(null)} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl md:rounded-2xl transition-all shadow-sm"><FiX size={16} /></button>
                
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-dashed border-slate-50 pb-6 md:pb-8 mb-6 md:mb-10">
                    <div className="space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center gap-2 mb-1"><FiFileText /> Academic Record</p>
                        <h3 className="text-xl md:text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter">{searchResult.name}</h3>
                        <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-tight">ROLL: {searchResult.rollNo} • {searchResult.course} S{searchResult.semester}</p>
                    </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {searchResult.subjects.map((s, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border border-white">
                            <span className="text-[10px] md:text-[12px] font-[900] text-slate-700 uppercase italic">{s.subName}</span>
                            <div className="flex items-center gap-4 md:gap-10">
                                <span className="text-[11px] md:text-[13px] font-black text-indigo-600 italic">{Number(s.marks).toFixed(2)}</span>
                                <span className={`px-3 py-1 md:px-5 md:py-2 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest ${Number(s.marks) >= 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {Number(s.marks) >= 4 ? 'PASS' : 'BACK'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t-2 border-dashed border-slate-50 flex justify-between items-center text-slate-900">
                     <p className="text-xl md:text-4xl font-[900] italic tracking-tighter text-indigo-900">
                        {searchResult.subjects.reduce((a,b)=>a+Number(b.marks),0).toFixed(2)}
                     </p>
                     <span className="px-6 py-2.5 md:px-10 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest italic shadow-lg">Official Pass</span>
                </div>
            </div>
        )}

        {/* Data Entry Protocol */}
        <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                <h2 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest italic mb-6 md:mb-10 flex items-center gap-3"><FiUser className="text-indigo-600" /> Identity</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6">
                    <div className="relative group">
                        <FiUser className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input className="w-full pl-12 md:pl-16 pr-4 py-3 md:py-5 bg-slate-50 border-none rounded-[1rem] md:rounded-[1.5rem] text-[10px] md:text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 shadow-inner" placeholder="STUDENT NAME" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                    </div>
                    <div className="relative group">
                        <FiSmartphone className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input type="number" className="w-full pl-12 md:pl-16 pr-4 py-3 md:py-5 bg-slate-50 border-none rounded-[1rem] md:rounded-[1.5rem] text-[10px] md:text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 shadow-inner" placeholder="ROLL NO" value={student.roll} onChange={(e) => setStudent({ ...student, roll: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-8">
                    <div className="relative">
                        <FiLayers className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none hidden sm:block" />
                        <select className="w-full sm:pl-16 px-4 py-3 md:py-4 bg-slate-50 rounded-[1rem] text-[9px] md:text-[11px] font-black uppercase outline-none appearance-none" value={student.course} onChange={(e) => setStudent({ ...student, course: e.target.value })}>
                            <option value="">Dept</option>
                            {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <FiBookOpen className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none hidden sm:block" />
                        <select className="w-full sm:pl-16 px-4 py-3 md:py-4 bg-slate-50 rounded-[1rem] text-[9px] md:text-[11px] font-black uppercase outline-none appearance-none" value={student.semester} onChange={(e) => setStudent({ ...student, semester: e.target.value })}>
                            <option value="">Sem</option>
                            {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <FiCalendar className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none hidden sm:block" />
                        <select className="w-full sm:pl-16 px-4 py-3 md:py-4 bg-slate-50 rounded-[1rem] text-[9px] md:text-[11px] font-black uppercase outline-none appearance-none" value={student.section} onChange={(e) => setStudent({ ...student, section: e.target.value })}>
                            <option value="">Sec</option>
                            {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <h2 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Intake</h2>
                    <button onClick={addSubjectRow} className="px-5 py-2.5 md:px-8 md:py-4 bg-slate-900 text-white rounded-[1rem] md:rounded-[1.5rem] text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-xl">+ Subject</button>
                </div>
                
                <div className="space-y-3 md:space-y-6">
                    {subjects.map((s, i) => (
                        <div key={i} className="flex gap-2 md:gap-6 bg-slate-50/30 p-2 md:p-4 rounded-[1.2rem] md:rounded-[2rem] border border-slate-50">
                            <input className="flex-[4] px-4 md:px-8 py-3 md:py-5 bg-white border-none rounded-[1rem] md:rounded-[1.5rem] text-[10px] md:text-[13px] font-[900] uppercase italic shadow-sm" placeholder="SUBJECT" value={s.subName} onChange={(e) => handleSubjectChange(i, "subName", e.target.value)} />
                            <input type="number" className="flex-[1.5] px-2 md:px-8 py-3 md:py-5 bg-white border-none rounded-[1rem] md:rounded-[1.5rem] text-[11px] md:text-[14px] font-[900] text-indigo-600 text-center italic shadow-sm" placeholder="MKS" value={s.marks} onChange={(e) => handleSubjectChange(i, "marks", e.target.value)} />
                            <button onClick={() => deleteSubject(i)} className="p-2 md:p-4 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><FiTrash2 size={18} /></button>
                        </div>
                    ))}
                    {subjects.length === 0 && <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-[2rem] text-[10px] font-black text-slate-200 uppercase tracking-widest italic">Awaiting Data</div>}
                </div>

                {subjects.length > 0 && (
                    <div className="mt-8 md:mt-12 pt-6 md:pt-10 border-t-2 border-dashed border-slate-50">
                        <button disabled={loading} onClick={handleSubmit} className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-[1.2rem] md:rounded-[2rem] text-[10px] md:text-[12px] font-black uppercase tracking-widest italic shadow-2xl disabled:opacity-50">
                            {loading ? "BROADCASTING..." : "SUBMIT TRANSCRIPT"}
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
