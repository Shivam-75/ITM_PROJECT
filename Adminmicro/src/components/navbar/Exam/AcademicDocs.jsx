import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2, FiFileText, FiBook, FiSave, FiX, FiLayers, FiClock } from "react-icons/fi";
import { ReportAPI, WorkAPI } from "../../../api/apis";
import Loader from "../../Loader";

const AcademicDocs = () => {
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState({ syllabus: [], modelPapers: [] });
    const [activeTab, setActiveTab] = useState("syllabus"); // "syllabus" | "modelPaper"
    const [showForm, setShowForm] = useState(false);
    
    // Registries
    const [registries, setRegistries] = useState({ courses: [], semesters: [], years: [] });
    
    // Form State
    const [formData, setFormData] = useState({
        course: "", semester: "", year: "", title: "", subject: "", duration: "3 Hours", totalMarks: "70", fileUrl: ""
    });

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch Registries
            const [c, s, y] = await Promise.all([
                WorkAPI.get("/Academic/Course/view"),
                WorkAPI.get("/Academic/Semester/view"),
                WorkAPI.get("/Academic/Year/view")
            ]);
            setRegistries({ courses: c.data.data, semesters: s.data.data, years: y.data.data });

            // Fetch Current Docs
            const syllabusRes = await WorkAPI.get("/Admin/Document/Syllabus");
            const papersRes = await WorkAPI.get("/Admin/Document/ModelPaper");
            
            setDocs({ 
                syllabus: syllabusRes.data.data || [], 
                modelPapers: papersRes.data.data || [] 
            });
        } catch (err) {
            toast.error("Failed to fetch academic records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const endpoint = activeTab === "syllabus" ? "/Admin/Document/Syllabus" : "/Admin/Document/ModelPaper";
            await WorkAPI.post(endpoint, formData);
            toast.success(`${activeTab === "syllabus" ? "Syllabus" : "Model Paper"} Published`);
            setShowForm(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Are you sure you want to remove this document?")) return;
        try {
            setLoading(true);
            const endpoint = type === "syllabus" ? `/Admin/Document/Syllabus/${id}` : `/Admin/Document/ModelPaper/${id}`;
            await WorkAPI.delete(endpoint);
            toast.success("Document Removed");
            fetchAll();
        } catch (err) {
            toast.error("Delete Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen space-y-6">
            {loading && <Loader />}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <div>
                   <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Registry <span className="text-red-600">Documents</span>
                   </h1>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Manage Institutional Syllabi & Practice Assets</p>
                </div>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-gray-200"
                >
                  <FiPlus size={16} /> New Document
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 p-2 bg-gray-100/50 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab("syllabus")}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "syllabus" ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                    Syllabus Registry
                </button>
                <button 
                    onClick={() => setActiveTab("modelPaper")}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "modelPaper" ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-600"}`}
                >
                    Model Papers
                </button>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "syllabus" ? docs.syllabus : docs.modelPapers).map((item) => (
                    <div key={item._id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(item._id, activeTab)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:bg-gray-900 group-hover:text-white transition-all">
                           <FiFileText size={28} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic leading-none">{item.title || item.subject}</h3>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{item.course}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                                {activeTab === "syllabus" ? `Year: ${item.year}` : `Sem: ${item.semester}`}
                            </span>
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-gray-900 uppercase underline underline-offset-4 tracking-widest hover:text-red-600">View File</a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Entry Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Publication Portal</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adding to {activeTab} registry</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm transition-all">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-10 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Institutional Course</label>
                                    <select 
                                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all appearance-none uppercase italic"
                                      value={formData.course} 
                                      onChange={(e) => setFormData({...formData, course: e.target.value})}
                                      required
                                    >
                                        <option value="">Select Course</option>
                                        {registries.courses.map(c => <option key={c._id} value={c.courses}>{c.courses}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Release Cycle (Year)</label>
                                    <select 
                                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all appearance-none uppercase italic"
                                      value={formData.year} 
                                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                                      required
                                    >
                                        <option value="">Select Year</option>
                                        {registries.years.map(y => <option key={y._id} value={y.Year}>{y.Year}</option>)}
                                    </select>
                                </div>
                            </div>

                            {activeTab === "modelPaper" && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Module (Semester)</label>
                                        <select 
                                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all appearance-none uppercase italic"
                                          value={formData.semester} 
                                          onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                          required
                                        >
                                            <option value="">Select Semester</option>
                                            {registries.semesters.map(s => <option key={s._id} value={s.Semester}>{s.Semester}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Assessment Max Score</label>
                                        <input 
                                          type="text" 
                                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all italic"
                                          placeholder="e.g. 70"
                                          value={formData.totalMarks}
                                          onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Document Heading</label>
                                <input 
                                  type="text" 
                                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all italic"
                                  placeholder={activeTab === "syllabus" ? "Course Name / Year" : "Subject Name"}
                                  value={activeTab === "syllabus" ? formData.title : formData.subject}
                                  onChange={(e) => setFormData({...formData, [activeTab === "syllabus" ? 'title' : 'subject']: e.target.value})}
                                  required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 italic">Content Access URL (Drive/S3)</label>
                                <input 
                                  type="url" 
                                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-gray-100 outline-none transition-all italic"
                                  placeholder="https://..."
                                  value={formData.fileUrl}
                                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                  required
                                />
                            </div>

                            <button type="submit" className="w-full py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-2xl shadow-gray-200 active:scale-95 italic">
                                Finalize Publication
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicDocs;
