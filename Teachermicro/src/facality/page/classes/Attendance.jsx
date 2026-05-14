import { useState, useMemo, useEffect, useCallback } from "react";
import { TeacherService, AcademicService } from "../../api/apis";
import { toast } from "react-toastify";
import useAuth from "../../../store/FacultyStore";
import BigLoader from "../../common/BigLoader";
import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";
import { 
  FiUsers, FiCheckCircle, FiXCircle, FiFilter, FiCalendar, 
  FiBookOpen, FiLayers, FiSave, FiAward, FiClock, FiActivity
} from "react-icons/fi";

export default function AttendancePage() {
  const { toststyle } = useAuth();
  const { courses, semesters, sections, years, batches, periods, loading: registryLoading } = useAcademicRegistry();
  
  // 🔹 CORE STATES
  const [attendance, setAttendance] = useState({}); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  
  const [subjectsList, setSubjectsList] = useState([]);
  const [activeView, setActiveView] = useState("registry"); 
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH SUBJECTS
  const fetchSubjects = useCallback(async () => {
    try {
      const data = await AcademicService.getSubjects();
      if (data.subjects) setSubjectsList(data.subjects);
    } catch (err) {
      console.error("Subject fetch failed", err);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const filteredSubjects = useMemo(() => {
    if (!selectedCourse || !selectedSemester) return [];
    return subjectsList.filter(s => 
      s.department?.toLowerCase() === selectedCourse?.toLowerCase() &&
      s.semester?.toLowerCase() === selectedSemester?.toLowerCase()
    );
  }, [selectedCourse, selectedSemester, subjectsList]);

  // 🔹 FETCH STUDENT REPOSITORY
  const fetchStudents = useCallback(async (isInitial = false) => {
    try {
      if (!isInitial) setLoading(true);
      const data = await TeacherService.getStudentList(); // Use cached service
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
    fetchStudents(true); // Initial/Cached check
  }, [fetchStudents]);

  // 🔹 CLASS FILTER LOGIC
  const filteredStudents = useMemo(() => {
    if (!selectedCourse || !selectedSemester || !selectedSection || !selectedYear || !selectedBatch) return [];
    
    return studentsData
      .filter((s) => 
        s.course?.toLowerCase() === selectedCourse.toLowerCase() &&
        String(s.semester) === String(selectedSemester) &&
        s.section?.toLowerCase() === selectedSection.toLowerCase() &&
        s.year?.toLowerCase() === selectedYear.toLowerCase() &&
        s.batch?.toLowerCase() === selectedBatch.toLowerCase()
      )
      .map(s => ({
        id: s._id,
        studentID: s.studentID || s.studentId || "N/A",
        name: s.name,
        rollNo: s.rollNo || "N/A"
      }));
  }, [studentsData, selectedCourse, selectedSemester, selectedSection, selectedYear, selectedBatch]);

  // 🔹 ATTENDANCE TOGGLE ENGINE
  const handleToggle = (studentId) => {
    setAttendance((prev) => {
        const currentBatch = prev[selectedDate] || {};
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
  const handleSaveAttendance = useCallback(async () => {
    if (!selectedDate || !selectedCourse || !selectedSemester || !selectedSection || !selectedSubject || !selectedYear || !selectedBatch || !selectedPeriod) {
      toast.error("VALIDATION ERROR: Please sync all filter parameters.", toststyle);
      return;
    }

    if (filteredStudents.length === 0) {
      toast.error("REGISTRY ERROR: No candidate data found for this batch.", toststyle);
      return;
    }

    const students = filteredStudents.map((student) => ({
      studentId: student.id,
      studentID: student.studentID,
      rollNo: student.rollNo,
      name: student.name,
      status: attendance[selectedDate]?.[student.id] === false ? "Absent" : "Present"
    }));

    try {
      setLoading(true);
      const payload = {
        date: selectedDate,
        subject: selectedSubject,
        course: selectedCourse,
        semester: selectedSemester,
        section: selectedSection,
        year: selectedYear,
        batch: selectedBatch,
        period: selectedPeriod,
        students
      };
      await TeacherService.submitAttendance(payload);
      toast.success("REGISTRY SYNCED: Attendance data officially broadcasted. ✅", toststyle);
    } catch (error) {
      toast.error(error?.response?.data?.message || "BROADCAST FAILURE", toststyle);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedCourse, selectedSemester, selectedSection, selectedSubject, selectedYear, selectedBatch, selectedPeriod, filteredStudents, attendance, toststyle]);

  return (
    <div className="min-h-[100dvh] bg-pink-50 pt-6 px-4 md:px-8 pb-32">
      {(loading || registryLoading) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-[100]">
          <BigLoader />
        </div>
      )}

      {/* ===== REGISTRY HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Attendance Registry</h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-[10px] border border-slate-100 shadow-sm w-full md:w-auto">
                <button onClick={() => setActiveView("registry")} className={`flex-1 md:px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'registry' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Registry</button>
                <button onClick={() => setActiveView("analytics")} className={`flex-1 md:px-8 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${activeView === 'analytics' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Analytics</button>
          </div>
      </div>

      <div className="w-full space-y-6">
        
        {/* ===== FILTER MATRIX ===== */}
        <div className="bg-white p-6 md:p-8 rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/30">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
                <FiFilter className="text-indigo-600" /> Class Selection Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <div className="relative group">
                    <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none" />
                    <div className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[10px] text-[11px] font-black uppercase shadow-sm flex items-center">
                        {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
                    </div>
                </div>

                <div className="relative group">
                    <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">DEPARTMENT</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">ACADEMIC YEAR</option>
                        {years.map(y => <option key={y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiActivity className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                        <option value="">ACADEMIC BATCH</option>
                        {batches.map(b => <option key={b._id} value={b.name}>{b.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                        <option value="">SEMESTER</option>
                        {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiCheckCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        <option value="">SECTION</option>
                        {sections.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">SUBJECT NAME</option>
                        {filteredSubjects.map(sub => <option key={sub._id} value={sub.name}>{sub.name.toUpperCase()}</option>)}
                    </select>
                </div>

                <div className="relative group">
                    <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-slate-100 rounded-[10px] text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer transition-all shadow-sm" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                        <option value="">SELECT PERIOD</option>
                        {periods.map(p => <option key={p._id} value={p.name}>{p.name.toUpperCase()} ({p.startTime}-{p.endTime})</option>)}
                    </select>
                </div>
            </div>
        </div>

        {filteredStudents.length > 0 && activeView === "registry" && (
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Statistics Pods */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-[10px] text-slate-900 border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Total Strength</p>
                        <p className="text-3xl font-black italic tracking-tighter">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-[10px] border border-emerald-100 shadow-sm shadow-emerald-50">
                        <p className="text-[9px] font-black text-emerald-600/60 uppercase italic mb-1">Present Intake</p>
                        <p className="text-3xl font-black text-emerald-600 italic tracking-tighter">{stats.present}</p>
                    </div>
                    <div className="bg-rose-50 p-6 rounded-[10px] border border-rose-100 shadow-sm shadow-rose-50">
                        <p className="text-[9px] font-black text-rose-600/60 uppercase italic mb-1">Absentee Yield</p>
                        <p className="text-3xl font-black text-rose-600 italic tracking-tighter">{stats.absent}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[10px] border border-slate-100 flex items-center justify-center gap-6 shadow-sm">
                        <button onClick={() => handleMarkAll(true)} className="flex flex-col items-center gap-1 group">
                             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[10px] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"><FiCheckCircle size={18} /></div>
                             <span className="text-[8px] font-black uppercase italic mt-1">All P</span>
                        </button>
                        <button onClick={() => handleMarkAll(false)} className="flex flex-col items-center gap-1 group">
                             <div className="p-3 bg-rose-50 text-rose-600 rounded-[10px] group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm"><FiXCircle size={18} /></div>
                             <span className="text-[8px] font-black uppercase italic mt-1">All A</span>
                        </button>
                    </div>
                </div>

                {/* Registry Ledger */}
                <div className="bg-white p-8 md:p-10 rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-slate-50 gap-4">
                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                            <FiUsers className="text-indigo-600" /> Active Registry Ledger
                        </h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase italic bg-white border border-slate-100 px-4 py-2 rounded-full border border-slate-100">
                           {selectedDate} • {selectedSubject || 'No Subject Defined'} • {selectedPeriod}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredStudents.map((s) => {
                            const isPresent = attendance[selectedDate]?.[s.id] !== false;
                            return (
                                <div key={s.id} className="flex justify-between items-center bg-white p-4 md:p-5 rounded-[10px] border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all border border-slate-100">
                                            {s.rollNo.slice(-2)}
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] font-black text-slate-800 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{s.name}</h4>
                                            <p className="text-[8px] font-black text-slate-400 uppercase italic mt-0.5 tracking-widest">{s.rollNo}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(s.id)}
                                        className={`px-8 py-3 rounded-[10px] text-[10px] font-black uppercase italic tracking-widest transition-all shadow-md ${isPresent ? 'bg-emerald-500 text-white shadow-emerald-100/50' : 'bg-rose-500 text-white shadow-rose-100/50'}`}
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
                            className="px-16 py-5 bg-slate-900 text-white rounded-[10px] text-[12px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center gap-4"
                         >
                            {loading ? (
                               <>
                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                 SYNCING...
                               </>
                            ) : (
                               <>
                                 <FiSave size={20} /> SYNC REGISTRY
                               </>
                            )}
                         </button>
                    </div>
                </div>
            </div>
        )}

        {(filteredStudents.length === 0 || !selectedYear || !selectedBatch || !selectedPeriod) && activeView === "registry" && (
            <div className="bg-white py-32 rounded-[10px] border border-dashed border-slate-100 flex flex-col items-center justify-center text-center px-10">
                 <div className="p-8 bg-white text-slate-200 rounded-[10px] mb-6 shadow-sm">
                    <FiUsers size={60} />
                 </div>
                 <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Awaiting Archive Load</h2>
                 <p className="max-w-md text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">
                    Please define all Academic Parameters (Year, Batch, Period, etc.) to reconstruct the live attendance registry.
                 </p>
            </div>
        )}

      </div>
    </div>
  );
}
