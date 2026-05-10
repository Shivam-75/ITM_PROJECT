import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ReportAPI } from "../../api/apis";
import useAuth from "../../../store/FacultyStore";
import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";
import { 
  FiPlus, FiTrash2, FiSearch, FiX, FiUser, 
  FiSmartphone, FiLayers, FiBookOpen, FiCalendar, 
  FiCheckCircle, FiFileText, FiAward, FiBook, FiSend
} from "react-icons/fi";

export default function FacResult() {
  const { toststyle } = useAuth();
  const { courses, semesters, sections, years, loading: registryLoading } = useAcademicRegistry();
  
  const [searchRoll, setSearchRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [student, setStudent] = useState({
    name: "", 
    roll: "", // Mapping to userId in schema
    course: "", 
    year: "",
    semester: "", 
    section: "",
  });

  const [entries, setEntries] = useState([]);
  const [searchResult, setSearchResult] = useState(null);

  const addSubjectRow = () => {
    setEntries([...entries, { subject: "", marks: "" }]);
  };

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const deleteEntry = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  const handleSubmit = async () => {
    if (!student.roll || !student.course || !student.year || !student.semester || !student.section) {
        toast.error("IDENTIFICATION REQUIRED: All academic fields + Roll ID must be set.", toststyle);
        return;
    }
    if (entries.length === 0 || entries.some(s => !s.subject.trim() || s.marks === "")) {
        toast.error("INTAKE ERROR: Please define subjects and marks properly.", toststyle);
        return;
    }

    try {
        setLoading(true);
        const { data } = await ReportAPI.post("/Mark/uploade", {
            userId: student.roll,
            course: student.course,
            year: student.year,
            section: student.section,
            semester: student.semester,
            entries: entries
        });
        toast.success(data?.message || "Successfully Marks Uploaded !!", toststyle);
        setStudent({ name: "", roll: "", course: "", year: "", semester: "", section: "" });
        setEntries([]);
    } catch (err) {
        toast.error(err.response?.data?.message || "Broadcast Failure", toststyle);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = async () => {
      if(!searchRoll.trim()) return;
      try {
          setSearching(true);
          const { data } = await ReportAPI.get("/Mark/uploade");
          const found = data?.data?.find(m => String(m.userId) === searchRoll.trim());
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
    <div className="min-h-[100dvh] bg-[#f8fafc] pt-6 px-4 md:px-8 pb-32">
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Sessional Mark</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                  <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    className="w-full md:w-80 pl-14 pr-4 py-4 bg-white border-none rounded-lg text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-slate-900 shadow-sm font-mono"
                    placeholder="ENTER ROLL ID" 
                    value={searchRoll}
                    onChange={(e) => setSearchRoll(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
              </div>
              <button onClick={handleSearch} disabled={searching} className="p-4 bg-slate-900 text-white rounded-lg shadow-xl hover:bg-indigo-600 transition-all">
                  {searching ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FiSearch size={20} />}
              </button>
          </div>
      </div>

      <div className="w-full space-y-8">
        
        {/* Search Result Dashboard */}
        {searchResult && (
            <div className="bg-white p-8 md:p-12 rounded-lg border border-slate-100 shadow-2xl shadow-slate-200/40 animate-in zoom-in-95 duration-500 relative">
                <button onClick={() => setSearchResult(null)} className="absolute top-6 right-6 p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all shadow-sm"><FiX size={18} /></button>
                
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-dashed border-slate-50 pb-8 mb-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic flex items-center gap-2 mb-2"><FiFileText /> Academic Record</p>
                        <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Student Transcript</h3>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ROLL ID: {searchResult.userId} • {searchResult.course} • S{searchResult.semester} • {searchResult.year}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResult.entries.map((s, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50/50 p-6 rounded-lg border border-white">
                            <span className="text-[12px] font-black text-slate-700 uppercase italic">{s.subject}</span>
                            <div className="flex items-center gap-6">
                                <span className="text-[14px] font-black text-indigo-600 italic tracking-widest">{Number(s.marks).toFixed(1)}</span>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${Number(s.marks) >= 17 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {Number(s.marks) >= 17 ? 'PASS' : 'RE-TRY'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-50 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic italic">Aggregate Yield</span>
                        <p className="text-4xl font-black italic tracking-tighter text-slate-900">
                            {searchResult.entries.reduce((a,b)=>a+Number(b.marks),0).toFixed(1)}
                        </p>
                     </div>
                     <span className="px-10 py-4 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-emerald-100">Official Protocol</span>
                </div>
            </div>
        )}

        {/* Data Entry Protocol */}
        <div className="space-y-6">
            <div className="bg-white p-6 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/30">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-8 flex items-center gap-3">
                    <FiUser className="text-indigo-600" /> Identity Synchronization
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="relative group">
                        <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <input className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-none rounded-lg text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 shadow-inner" placeholder="STUDENT NAME (OPTIONAL)" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
                    </div>
                    <div className="relative group">
                        <FiSmartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <input className="w-full pl-16 pr-4 py-4.5 bg-slate-50 border-none rounded-lg text-[12px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 shadow-inner font-mono" placeholder="ENTER ROLL ID / USER ID" value={student.roll} onChange={(e) => setStudent({ ...student, roll: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative group">
                        <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-inner" value={student.course} onChange={(e) => setStudent({ ...student, course: e.target.value })}>
                            <option value="">DEPARTMENT</option>
                            {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="relative group">
                        <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-inner" value={student.year} onChange={(e) => setStudent({ ...student, year: e.target.value })}>
                            <option value="">ACADEMIC YEAR</option>
                            {years.map(y => <option key={y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="relative group">
                        <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-inner" value={student.semester} onChange={(e) => setStudent({ ...student, semester: e.target.value })}>
                            <option value="">SEMESTER</option>
                            {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <div className="relative group">
                        <FiCheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer appearance-none shadow-inner" value={student.section} onChange={(e) => setStudent({ ...student, section: e.target.value })}>
                            <option value="">SECTION</option>
                            {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/30">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic flex items-center gap-3">
                        <FiBook className="text-indigo-600" /> Intake Protocols
                    </h2>
                    <button onClick={addSubjectRow} className="px-8 py-3.5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-widest italic shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2">
                        <FiPlus size={14} /> Subject
                    </button>
                </div>
                
                <div className="space-y-4">
                    {entries.map((s, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex-[4] relative">
                                <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <input className="w-full pl-14 pr-4 py-4 bg-white border-none rounded-lg text-[11px] font-black uppercase italic shadow-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="SUBJECT NAME" value={s.subject} onChange={(e) => handleEntryChange(i, "subject", e.target.value)} />
                            </div>
                            <div className="flex-[1.5] relative">
                                <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <input type="number" className="w-full pl-14 pr-4 py-4 bg-white border-none rounded-lg text-[12px] font-black text-indigo-600 text-center italic shadow-sm outline-none focus:ring-2 focus:ring-slate-900" placeholder="MARKS" value={s.marks} onChange={(e) => handleEntryChange(i, "marks", e.target.value)} />
                            </div>
                            <button onClick={() => deleteEntry(i)} className="p-4 text-rose-500 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center border border-transparent hover:border-rose-100">
                                <FiTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-lg">
                            <FiFileText size={40} className="mx-auto text-slate-100 mb-4" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Awaiting Protocol Intake</p>
                        </div>
                    )}
                </div>

                {entries.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-slate-50 flex justify-end">
                        <button 
                            disabled={loading} 
                            onClick={handleSubmit} 
                            className="w-full md:w-fit px-20 py-5 bg-slate-900 text-white rounded-lg text-[12px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                        >
                            <FiSend size={18} />
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
