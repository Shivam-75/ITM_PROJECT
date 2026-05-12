import { useState, useMemo, useEffect, useCallback } from "react";
import { authAPI, ReportAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import useAuth from "../../../store/AdminStore";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiFilter, 
  FiCalendar, 
  FiBookOpen, 
  FiLayers, 
  FiSave, 
  FiAward, 
  FiShield,
  FiDatabase
} from "react-icons/fi";

export default function Markattendance() {
  const { toststyle } = useAuth();
  
  // 🔹 CORE STATES
  const [attendance, setAttendance] = useState({}); // { [date]: { [studentId]: true/false } }
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH STUDENT REPOSITORY FROM AUTH SERVICE
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
        rollNo: s.studentId || "N/A"
      }));
  }, [studentsData, selectedCourse, selectedSemester, selectedSection]);

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
        teacherId: "ADMIN_OVERRIDE", // Admin is marking this
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* ===== REGISTRY HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col">
              <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                Attendance <span className="text-red-600">Marking</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2 italic">
                <FiDatabase className="text-red-600" /> Administrative Override Console
              </p>
          </div>
      </div>

      <div className="space-y-8">
        {/* ===== FILTER MATRIX ===== */}
        <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-6 flex items-center gap-2">
                <FiFilter className="text-red-600" /> Class Selection Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative group">
                    <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" className="w-full pl-14 pr-4 py-4 bg-white border border-transparent rounded-lg text-[11px] font-black uppercase outline-none focus:bg-white focus:border-red-600 transition-all italic" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div className="relative group">
                    <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-transparent rounded-lg text-[11px] font-black uppercase outline-none focus:bg-white focus:border-red-600 transition-all italic cursor-pointer" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <option value="">DEPARTMENT</option><option>BCA</option><option>BBA</option><option>MCA</option><option>MBA</option>
                    </select>
                </div>
                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-transparent rounded-lg text-[11px] font-black uppercase outline-none focus:bg-white focus:border-red-600 transition-all italic cursor-pointer" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                        <option value="">SEMESTER</option>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select className="w-full pl-14 pr-4 py-4 bg-white border border-transparent rounded-lg text-[11px] font-black uppercase outline-none focus:bg-white focus:border-red-600 transition-all italic cursor-pointer" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                        <option value="">SECTION</option>{['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiBookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="w-full pl-14 pr-4 py-4 bg-white border border-transparent rounded-lg text-[11px] font-black uppercase outline-none focus:bg-white focus:border-red-600 transition-all italic" placeholder="SUBJECT NAME" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} />
                </div>
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-[10px] font-black uppercase italic tracking-widest text-gray-400">Syncing Registry...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                {/* Statistics Pods */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-lg text-gray-900 border border-slate-100 shadow-sm shadow-xl shadow-black/10">
                        <p className="text-[10px] font-black text-gray-500 uppercase italic mb-1">Total Strength</p>
                        <p className="text-4xl font-black italic tracking-tighter">{stats.total}</p>
                    </div>
                    <div className="bg-emerald-50 p-8 rounded-lg border border-emerald-100 shadow-sm">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase italic mb-1">Present Intake</p>
                        <p className="text-4xl font-black text-emerald-600 italic tracking-tighter">{stats.present}</p>
                    </div>
                    <div className="bg-red-50 p-8 rounded-lg border border-red-100 shadow-sm">
                        <p className="text-[10px] font-black text-red-600/60 uppercase italic mb-1">Absentee Yield</p>
                        <p className="text-4xl font-black text-red-600 italic tracking-tighter">{stats.absent}</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg border border-slate-100 flex items-center justify-center gap-8 shadow-sm">
                        <button onClick={() => handleMarkAll(true)} className="flex flex-col items-center gap-2 group">
                             <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"><FiCheckCircle size={20} /></div>
                             <span className="text-[9px] font-black uppercase italic">Mark All P</span>
                        </button>
                        <button onClick={() => handleMarkAll(false)} className="flex flex-col items-center gap-2 group">
                             <div className="p-4 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm"><FiXCircle size={20} /></div>
                             <span className="text-[9px] font-black uppercase italic">Mark All A</span>
                        </button>
                    </div>
                </div>

                {/* Registry Ledger */}
                <div className="bg-white p-10 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                        <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-3">
                            <FiUsers className="text-red-600" /> Active Registry Ledger
                        </h2>
                        <span className="text-[10px] font-black text-gray-400 uppercase italic bg-white px-4 py-2 rounded-lg">
                          {selectedDate} • {selectedSubject || 'No Subject Defined'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredStudents.map((s) => {
                            const isPresent = attendance[selectedDate]?.[s.id] !== false;
                            return (
                                <div key={s.id} className="flex justify-between items-center bg-white/50 p-6 rounded-lg border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm border border-slate-100">
                                            ID
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-tight">{s.name}</h4>
                                            <p className="text-[9px] font-black text-gray-400 uppercase italic">Protocol: {s.rollNo}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggle(s.id)}
                                        className={`px-10 py-3 rounded-lg text-[10px] font-black uppercase italic tracking-widest transition-all shadow-md ${isPresent ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-600 text-white shadow-red-600/20'}`}
                                    >
                                        {isPresent ? 'PRESENT' : 'ABSENT'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-16 flex justify-end">
                         <button 
                            disabled={loading}
                            onClick={handleSaveAttendance}
                            className="px-20 py-6 bg-[#111111] text-white rounded-lg text-sm font-black uppercase tracking-[0.3em] italic shadow-2xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-4 group"
                         >
                            <FiSave size={20} className="group-hover:scale-125 transition-transform" /> Sync Registry
                         </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white py-40 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center px-10 shadow-sm border-dashed">
                 <div className="p-10 bg-white text-gray-200 rounded-lg mb-8">
                    <FiUsers size={64} />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-3">Awaiting Registry Archive</h2>
                 <p className="max-w-md text-[11px] font-black text-gray-400 uppercase tracking-widest italic leading-relaxed">
                    Please define the Academic Department, Semester, and Section to reconstruct the live student registry ledger for marking.
                 </p>
            </div>
        )}

      </div>
    </div>
  );
}




