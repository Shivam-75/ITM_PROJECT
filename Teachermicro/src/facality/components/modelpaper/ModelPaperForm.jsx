import React, { useCallback, useEffect, useState, useMemo } from "react";
import { AcademicAPI } from "../../api/apis";
import { toast } from "react-toastify";
import { 
  FiPlus, FiLayers, FiCalendar, FiBook, 
  FiTrash2, FiEdit, FiCheckCircle, FiFileText, FiSend, FiX, FiUploadCloud
} from "react-icons/fi";

const emptyState = {
  department: "",
  year: "",
  semester: "",
  section: "",
  subject: "",
  paperImage: null
};

const ModelPaperForm = ({ onSave, onCancel, initialData, loading }) => {
  const [formData, setFormData] = useState(initialData || emptyState);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyState);
    }
  }, [initialData]);
  
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
      console.error("Model Paper Registry Sync Failed", err);
    }
  }, []);

  useEffect(() => {
    fetchRegistries();
  }, [fetchRegistries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paperImage: e.target.files[0]
    }));
  };

  const filteredSubjects = useMemo(() => {
    if (!formData.department || !formData.semester) return [];
    return subjectsList.filter(s => 
      s.department?.toLowerCase() === formData.department?.toLowerCase() &&
      s.semester?.toLowerCase() === formData.semester?.toLowerCase()
    );
  }, [formData.department, formData.semester, subjectsList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.year || !formData.semester || !formData.section || !formData.subject || (!initialData && !formData.paperImage)) {
      toast.error("Please fill all mandatory fields properly.", { theme: "colored" });
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-[10px] border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10 relative overflow-hidden">
       <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm">
                        <option value="">Select Path</option>
                        {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Year</label>
                    <select name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm">
                        <option value="">Select Stage</option>
                        {yearsList.map(y => <option key={y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Semester</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm">
                        <option value="">Select Phase</option>
                        {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Section</label>
                    <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm">
                        <option value="">Select Local</option>
                        {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-white  rounded-[10px] text-[10px] font-black uppercase appearance-none outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm">
                        <option value="">Select Subject</option>
                        {filteredSubjects.map(sub => <option key={sub._id} value={sub.name}>{sub.name.toUpperCase()}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Paper Image/PDF</label>
                    <div className="relative group">
                        <input 
                            type="file" 
                            name="paperImage" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            accept="image/*,application/pdf"
                        />
                        <div className="w-full px-5 py-3 bg-white border border-slate-100 border-2 border-dashed border-slate-200 rounded-[10px] flex items-center gap-3 group-hover:border-slate-900 transition-all">
                            <FiUploadCloud className="text-slate-400 group-hover:text-slate-900" />
                            <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-900 truncate">
                                {formData.paperImage 
                                    ? (formData.paperImage instanceof File 
                                        ? formData.paperImage.name 
                                        : formData.paperImage.split('/').pop()) 
                                    : "Choose File"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-50">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-8 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic hover:text-slate-900 hover:border-slate-900 transition-all"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="px-12 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-[10px] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3 w-fit"
                >
                    <FiSend size={14} />
                    {loading ? "Syncing..." : "Publish"}
                </button>
            </div>
       </form>
    </div>
  );
};

export default ModelPaperForm;
