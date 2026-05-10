import React, { useState, useCallback, useEffect } from "react";
import { ReportAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";
import { 
  FiCalendar, FiPlus, FiSave, FiTrash2, 
  FiClock, FiBook, FiUser, FiLayers 
} from "react-icons/fi";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Timetable = () => {
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [activeDay, setActiveDay] = useState("Monday");
  const [loading, setLoading] = useState(false);

  const { courses, sections, semesters, loading: registryLoading } = useAcademicRegistry();

  const [formData, setFormData] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });

  const fetchExistingTimetable = useCallback(async () => {
    if (!course || !section || !semester) return;
    
    try {
      setLoading(true);
      const { data } = await ReportAPI.get("/TimeTable/uploader");
      
      const match = data?.data?.find(t => 
        t.course.toLowerCase() === course.toLowerCase() &&
        t.section.toLowerCase() === section.toLowerCase() &&
        t.semester.toString().toLowerCase() === semester.toString().toLowerCase() // String comparison
      );

      if (match) {
        const newFormData = {
          Monday: [], Tuesday: [], Wednesday: [], 
          Thursday: [], Friday: [], Saturday: []
        };
        
        // Group by Day
        match.timeSheet.forEach(item => {
          if (newFormData[item.day]) {
            newFormData[item.day].push({
                ...item,
                day: item.day // ensure day is present
            });
          }
        });
        
        // Sort each day by lecture number
        Object.keys(newFormData).forEach(d => {
            newFormData[d].sort((a, b) => a.lecture - b.lecture);
        });

        setFormData(newFormData);
        toast.info("Existing Schedule Loaded ⚡", { autoClose: 1000, theme: "colored" });
      } else {
          // Reset if no match found
          setFormData({
            Monday: [], Tuesday: [], Wednesday: [], 
            Thursday: [], Friday: [], Saturday: []
          });
      }
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  }, [course, section, semester]);

  React.useEffect(() => {
    fetchExistingTimetable();
  }, [fetchExistingTimetable]);

  const handleChange = (day, index, field, value) => {
    const updated = [...formData[day]];
    updated[index] = {
      ...updated[index],
      [field]: value,
      day: day,
    };
    setFormData({ ...formData, [day]: updated });
  };

  const addLecture = (day) => {
    setFormData({
      ...formData,
      [day]: [...formData[day], { day, teacher: "", subject: "", lecture: "", time: "" }],
    });
  };

  const removeLecture = (day, index) => {
    const updated = formData[day].filter((_, i) => i !== index);
    setFormData({ ...formData, [day]: updated });
  };

  const handleSubmitDay = async (day) => {
    if (!course || !section || !semester || formData[day].length === 0) {
      toast.error("Complete Course details and add at least one lecture", { theme: "colored" });
      return;
    }

    const payload = {
      course: course.toLowerCase(),
      section: section.toLowerCase(),
      semester: semester.toString().toLowerCase(), // Removed Number() casting
      timeSheet: formData[day],
    };

    try {
      setLoading(true);
      await ReportAPI.post("/TimeTable/uploader", payload);
      toast.success(`${day} Schedule Synchronized Successfully ✅`);
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to save ${day} schedule`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {(loading || registryLoading) && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <Loader />
        </div>
      )}

      {/* Simplified Header */}
      <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            Timetable Architect
          </h1>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="w-full space-y-8">
            {/* Global Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                <div className="relative group">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                    >
                        <option value="">SELECT COURSE</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    >
                        <option value="">SELECT SECTION</option>
                        {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="relative group">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select
                        className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-600 transition-all outline-none appearance-none cursor-pointer"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                    >
                        <option value="">SELECT SEMESTER</option>
                        {semesters.map(sem => <option key={sem.id} value={sem.name}>{sem.name.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-slate-100">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${
                            activeDay === day 
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                : "text-slate-400 hover:text-slate-900 hover:bg-white"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Lecture Listing Area */}
            <div className="space-y-6">
                {formData[activeDay].length === 0 ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-50 rounded-lg bg-white">
                        <FiCalendar size={40} className="mx-auto text-slate-100 mb-4" />
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest italic">No pulses added for {activeDay}</h3>
                        <button 
                            onClick={() => addLecture(activeDay)}
                            className="mt-6 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all italic"
                        >
                            + Start Architecture
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {formData[activeDay].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group animate-in slide-in-from-bottom-2">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="TEACHER NAME"
                                            className="w-full pl-10 pr-3 py-3 bg-white rounded-lg text-[10px] font-bold uppercase border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                                            value={item.teacher}
                                            onChange={(e) => handleChange(activeDay, idx, "teacher", e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="SUBJECT CODE/NAME"
                                            className="w-full pl-10 pr-3 py-3 bg-white rounded-lg text-[10px] font-bold uppercase border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                                            value={item.subject}
                                            onChange={(e) => handleChange(activeDay, idx, "subject", e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="TIME (E.G. 10:00-11:00)"
                                            className="w-full pl-10 pr-3 py-3 bg-white rounded-lg text-[10px] font-bold uppercase border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                                            value={item.time}
                                            onChange={(e) => handleChange(activeDay, idx, "time", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select
                                            className="flex-1 px-4 py-3 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                                            value={item.lecture}
                                            onChange={(e) => handleChange(activeDay, idx, "lecture", Number(e.target.value))}
                                        >
                                            <option value="">LECTURE #</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>Lec - {n}</option>)}
                                        </select>
                                        <button 
                                            onClick={() => removeLecture(activeDay, idx)}
                                            className="p-3 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => addLecture(activeDay)}
                                className="flex-1 flex items-center justify-center gap-3 py-5 bg-white border-2 border-dashed border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all group"
                            >
                                <FiPlus className="group-hover:rotate-90 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Add Lecture Node</span>
                            </button>
                            <button 
                                onClick={() => handleSubmitDay(activeDay)}
                                className="flex-1 flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl shadow-emerald-100 hover:bg-slate-900 transition-all active:scale-95 group"
                            >
                                <FiSave className="group-hover:scale-125 transition-transform" />
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
      </div>
    </div>
  );
};

export default Timetable;



