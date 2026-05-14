import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ReportAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../Loader";
import { FiLayers, FiAward, FiBookOpen, FiCheckCircle, FiFileText, FiTrash2, FiSearch, FiPrinter } from "react-icons/fi";

const BulkResults = () => {
    const [loading, setLoading] = useState(false);
    const [marksData, setMarksData] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [filters, setFilters] = useState({
        course: "",
        semester: "",
        section: "",
        year: "2026-27"
    });

    // Registry States
    const [courses, setCourses] = useState([]);
    const [semestersList, setSemestersList] = useState([]);
    const [yearsList, setYearsList] = useState([]);
    const [sectionsList, setSectionsList] = useState([]);

    const fetchRegistries = useCallback(async () => {
        try {
            const academicBase = "https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Academic";
            const [cRes, sRes, yRes, secRes] = await Promise.all([
                axios.get(`${academicBase}/courses`, { withCredentials: true }),
                axios.get(`${academicBase}/semesters`, { withCredentials: true }),
                axios.get(`${academicBase}/years`, { withCredentials: true }),
                axios.get(`${academicBase}/sections`, { withCredentials: true })
            ]);
            if (cRes.data.data) setCourses(cRes.data.data);
            if (sRes.data.data) setSemestersList(sRes.data.data);
            if (yRes.data.data) setYearsList(yRes.data.data);
            if (secRes.data.data) setSectionsList(secRes.data.data);
        } catch (err) {
            console.error("Registry Sync Failed", err);
        }
    }, []);

    const fetchBulkMarks = async () => {
        if (!filters.course || !filters.semester || !filters.section) {
            toast.info("Please select Department, Semester, and Section to fetch data.");
            return;
        }
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const { data } = await ReportAPI.get(`/Mark/BulkView?${query}`);
            setMarksData(data?.data || []);
        } catch (err) {
            setMarksData([]);
            toast.error(err.response?.data?.message || "No results found for these filters.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistries();
    }, [fetchRegistries]);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            setLoading(true);
            await ReportAPI.delete(`/Mark/delete/${deletingId}`);
            toast.success("Record Terminated Successfully");
            setShowDeleteModal(false);
            setDeletingId(null);
            fetchBulkMarks();
        } catch (err) {
            toast.error("Failed to delete record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-8 pb-32">
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <Loader />
                </div>
            )}

            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-red-600 rounded-full"></div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Bulk Sessional Archive</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Administrative Master Transcript Registry</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.print()} className="p-4 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-all">
                            <FiPrinter size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter Matrix */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                            <select 
                                className="w-full px-5 py-4 bg-white border border-slate-100 border-2 border-transparent rounded-xl text-[11px] font-black uppercase outline-none focus:border-red-600 transition-all appearance-none"
                                value={filters.course}
                                onChange={e => setFilters({...filters, course: e.target.value})}
                            >
                                <option value="">Select Dept</option>
                                {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                            <select 
                                className="w-full px-5 py-4 bg-white border border-slate-100 border-2 border-transparent rounded-xl text-[11px] font-black uppercase outline-none focus:border-red-600 transition-all appearance-none"
                                value={filters.semester}
                                onChange={e => setFilters({...filters, semester: e.target.value})}
                            >
                                <option value="">Select Sem</option>
                                {semestersList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section</label>
                            <select 
                                className="w-full px-5 py-4 bg-white border border-slate-100 border-2 border-transparent rounded-xl text-[11px] font-black uppercase outline-none focus:border-red-600 transition-all appearance-none"
                                value={filters.section}
                                onChange={e => setFilters({...filters, section: e.target.value})}
                            >
                                <option value="">Select Section</option>
                                {sectionsList.map(sec => <option key={sec._id} value={sec.name}>{sec.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={fetchBulkMarks}
                                className="w-full py-4 bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                            >
                                <FiSearch /> Sync Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-white border border-slate-100/50">
                                <tr>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Identity</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Context</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Matrix</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {marksData.length > 0 ? (
                                    marksData.map((res) => (
                                        <tr key={res._id} className="hover:bg-white border border-slate-100/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black italic">UID</div>
                                                    <span className="text-[13px] font-black text-slate-900 font-mono tracking-wider">{res.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[10px] font-black text-slate-700 uppercase italic mb-1">{res.course}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{res.semester} • {res.year} • SEC-{res.section}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {res.entries.map((ent, i) => (
                                                        <div key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg border border-slate-100 flex items-center gap-2 group-hover:bg-white transition-all">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase italic">{ent.subject}</span>
                                                            <div className="w-[1px] h-3 bg-slate-200"></div>
                                                            <span className="text-[11px] font-black text-red-600 italic">{ent.marks}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => { setDeletingId(res._id); setShowDeleteModal(true); }}
                                                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100 opacity-100"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-32 text-center">
                                            <FiFileText size={60} className="mx-auto text-slate-100 mb-6" />
                                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Archive Is Empty</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execute sync protocol to retrieve bulk marks data.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiTrash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-2">Delete Record?</h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                This action is permanent. This student's sessional data will be removed from the administrative archive.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 border-t border-slate-50">
                            <button 
                                onClick={() => { setShowDeleteModal(false); setDeletingId(null); }}
                                className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white border border-slate-100 transition-all border-r border-slate-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="py-6 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkResults;
