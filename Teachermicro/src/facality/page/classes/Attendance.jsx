import { useState, useMemo, useEffect, useCallback } from "react";
import { authAPI, ReportAPI } from "../../api/apis";
import { toast } from "react-toastify";
import useAuth from "../../../store/FacultyStore";
import BigLoader from "../../common/BigLoader";
import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";
import { FiUsers, FiCheckCircle, FiXCircle, FiFilter, FiCalendar, FiBookOpen, FiLayers, FiSave, FiAward, FiBarChart2 } from "react-icons/fi";

export default function AttendancePage() {
  const { toststyle } = useAuth();
  const { courses, semesters, sections, loading: registryLoading } = useAcademicRegistry();
  
  // 🔹 CORE STATES
  const [attendance, setAttendance] = useState({}); // { [date]: { [studentId]: true/false } }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  
  const [activeView, setActiveView] = useState("registry"); // registry | analytics
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH STUDENT REPOSITORY
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.get("/StudentList");
      if (data?.studentList) {
        setStudentsData(data.studentList);
      }
    } catch (err) {
      toast.error("SYSTEM ERROR: Failed to sync student repository.", toststyle);
    } finally {
      setLoading(false);
    }
  }, [toststyle]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 🔹 CLASS FILTER LOGIC
  const filteredStudents = useMemo(() => {
    if (!selectedCourse || !selectedSemester || !selectedSection) return [];
    
    return studentsData
      .filter((s) => 
        s.course?.toLowerCase() === selectedCourse.toLowerCase() &&
        String(s.semester) === String(selectedSemester) &&
        s.section?.toLowerCase() === selectedSection.toLowerCase()
      )
      .map(s => ({
        id: s._id,
        name: s.name,
        rollNo: s.rollNo || "N/A"
      }));
  }, [studentsData, selectedCourse, selectedSemester, selectedSection]);

  // 🔹 ATTENDANCE TOGGLE ENGINE
  const handleToggle = (studentId) => {
    setAttendance((prev) => {
        const currentBatch = prev[selectedDate] || {};
        // Default is Present (true), toggle flips it
        const currentStatus = currentBatch[studentId] === false ? true : false;
        return {
            ...prev,
            [selectedDate]: {
                ...currentBatch,
                [studentId]: currentStatus
            }
        };
    });
  };

  const handleMarkAll = (status) => {
      const batch = {};
      filteredStudents.forEach(s => { batch[s.id] = status; });
      setAttendance(prev => ({ ...prev, [selectedDate]: batch }));
  };

  // 🔹 STATISTICS CALCULATOR
  const stats = useMemo(() => {
      const currentBatch = attendance[selectedDate] || {};
      const present = filteredStudents.filter(s => currentBatch[s.id] !== false).length;
      const absent = filteredStudents.length - present;
      return { total: filteredStudents.length, present, absent };
  }, [attendance, selectedDate, filteredStudents]);

  // 🔹 PERSIST ATTENDANCE
  const handleSaveAttendance = async () => {
    if (!selectedDate || !selectedCourse || !selectedSemester || !selectedSection || !selectedSubject) {
      toast.error("VALIDATION ERROR: Please sync all filter parameters.", toststyle);
      return;
    }

    if (filteredStudents.length === 0) {
      toast.error("REGISTRY ERROR: No candidate data found for this batch.", toststyle);
      return;
    }

    const records = filteredStudents.map((student) => ({
      studentId: student.id,
      name: student.name,
      status: attendance[selectedDate]?.[student.id] === false ? "Absent" : "Present"
    }));

    try {
      setLoading(true);
      const payload = {
        date: selectedDate,
        subject: selectedSubject,
        course: selectedCourse,
        semester: Number(selectedSemester),
        section: selectedSection,
        records
      };
      await ReportAPI.post("/Attendance/uploader", payload);
      toast.success("REGISTRY SYNCED: Attendance data officially broadcasted. ✅", toststyle);
    } catch (error) {
      toast.error(error?.response?.data?.message || "BROADCAST FAILURE", toststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white pt-6 px-4 md:px-8 pb-32">
      {(loading || registryLoading) && <BigLoader />}

      {/* ===== REGISTRY HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
              <h1 className="text-2xl md:text-3xl font-[900] text-slate-900 uppercase italic tracking-tighter">Attendance Registry</h1>
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
                <button onClick={() => setActiveView("registry")} className={`flex-1 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'registry' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Registry</button>
                <button onClick={() => setActiveView("analytics")} className={`flex-1 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'analytics' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Analytics</button>
          </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== FILTER MATRIX ===== */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
                <FiFilter className="text-indigo-600" /> Class Selection Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative group">
                    <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="date" className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="relative group">
                    <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 cursor-pointer" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">DEPARTMENT</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 cursor-pointer" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                        <option value="">SEMESTER</option>
                        {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 cursor-pointer" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        <option value="">SECTION</option>
                        {sections.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900" placeholder="SUBJECT NAME" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                </div>
            </div>
        </div>

        {filteredStudents.length > 0 && activeView === "registry" && (
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Statistics Pods */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Total Strength</p>
                        <p className="text-3xl font-black italic tracking-tighter">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                        <p className="text-[9px] font-black text-emerald-600/60 uppercase italic mb-1">Present Intake</p>
                        <p className="text-3xl font-black text-emerald-600 italic tracking-tighter">{stats.present}</p>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                        <p className="text-[9px] font-black text-rose-600/60 uppercase italic mb-1">Absentee Yield</p>
                        <p className="text-3xl font-black text-rose-600 italic tracking-tighter">{stats.absent}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-center gap-6">
                        <button onClick={() => handleMarkAll(true)} className="flex flex-col items-center gap-1 group">
                             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><FiCheckCircle size={18} /></div>
                             <span className="text-[8px] font-black uppercase italic">All P</span>
                        </button>
                        <button onClick={() => handleMarkAll(false)} className="flex flex-col items-center gap-1 group">
                             <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><FiXCircle size={18} /></div>
                             <span className="text-[8px] font-black uppercase italic">All A</span>
                        </button>
                    </div>
                </div>

                {/* Registry Ledger */}
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                        <h2 className="text-[11px] font-[900] text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                            <FiUsers className="text-indigo-600" /> Active Registry Ledger
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase italic">{selectedDate} • {selectedSubject || 'No Subject Defined'}</span>
                    </div>

                    <div className="space-y-3">
                        {filteredStudents.map((s) => {
                            const isPresent = attendance[selectedDate]?.[s.id] !== false;
                            return (
                                <div key={s.id} className="flex justify-between items-center bg-slate-50/30 p-4 md:p-5 rounded-3xl border border-white hover:bg-white hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            -
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] md:text-[14px] font-[900] text-slate-800 uppercase italic tracking-tight">{s.name}</h4>
                                            <p className="text-[9px] font-black text-slate-300 uppercase italic">UNIVERSITY PROTOCOL: {s.rollNo}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(s.id)}
                                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all shadow-md ${isPresent ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'}`}
                                    >
                                        {isPresent ? 'PRESENT' : 'ABSENT'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-end">
                         <button 
                            disabled={loading}
                            onClick={handleSaveAttendance}
                            className="px-16 py-5 bg-slate-900 text-white rounded-[2rem] text-[12px] md:text-[14px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-4"
                         >
                            <FiSave size={20} /> SYNC REGISTRY
                         </button>
                    </div>
                </div>
            </div>
        )}

        {filteredStudents.length === 0 && (
            <div className="bg-white py-32 rounded-[3.5rem] border border-slate-100 flex flex-col items-center justify-center text-center px-10">
                 <div className="p-8 bg-slate-50 text-slate-200 rounded-[2.5rem] mb-6">
                    <FiUsers size={60} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Awaiting Archive Load</h2>
                 <p className="max-w-md text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">
                    Please define the Academic Department, Semester, and Section to reconstruct the live attendance registry.
                 </p>
            </div>
        )}

      </div>
    </div>
  );
}
