import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { 
  FiSearch, FiPrinter, FiBookOpen, FiUser, FiHash, 
  FiMapPin, FiCalendar, FiArrowRight, FiX, FiPlus, 
  FiFileText, FiTrash2, FiActivity, FiDollarSign 
} from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../store/AdminStore";
import { useNavigate } from "react-router-dom";
import { FiCreditCard } from "react-icons/fi";

const Feestructure = () => {
  const navigate = useNavigate();
  const { toststyle } = useAuth();
  const printRef = useRef();

  /* ================= STATES ================= */
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Registration Data for Selects
  const [registry, setRegistry] = useState({
    courses: [],
    batches: [],
    semesters: []
  });

  const [recentPayments, setRecentPayments] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    course: "",
    semester: "",
    batch: ""
  });

  // New States for Fee Publishing
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishForm, setPublishForm] = useState({
    department: "",
    course: "",
    batch: "",
    academicFee: 0,
    transportFee: 0,
    examinationFee: 0,
    uniformFee: 0,
    otherFee: 0,
    hostelFee: 0
  });

  /* ================= FETCHING ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [feeRes, courseRes, batchRes, semRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Fee/structure", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/batches", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true })
      ]);

      if (feeRes.data.structures) setFeeStructures(feeRes.data.structures);
      
      // Fetch Recent Payments
      await fetchRecentCollections();

      setRegistry({
        courses: courseRes.data.data || [],
        batches: batchRes.data.batches || [],
        semesters: semRes.data.data || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SEARCH STUDENT ================= */
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`http://localhost:5002/api/v3/Profile/student-list`, { withCredentials: true });
      const data = response.data.studentList.find(s => s.studentId.trim().toLowerCase() === searchId.trim().toLowerCase());

      if (!data) {
        setError("Student ID not found in Registry");
        setStudent(null);
        return;
      }
      setStudent({
        studentName: data.name,
        studentId: data.studentId,
        university: "AKTU, Lucknow",
        semester: `${data.semester}nd Semester`,
        course: data.course,
        batch: data.batch,
        email: data.email,
        phone: data.phone || "N/A"
      });
    } catch (err) {
      setError("Server Error: Registry Unreachable");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PUBLISH FEE ================= */
  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5002/api/v3/Admin/Fee/structure", publishForm, { withCredentials: true });
      toast.success(res.data.message, toststyle);
      setShowPublishModal(false);
      setPublishForm({
        department: "", course: "", batch: "",
        academicFee: 0, transportFee: 0,
        examinationFee: 0, uniformFee: 0, otherFee: 0, hostelFee: 0
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Publish Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStructure = async (id) => {
    if (!window.confirm("Purge this fee structure?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5002/api/v3/Admin/Fee/structure/${id}`, { withCredentials: true });
      toast.success("Structure Purged", toststyle);
      fetchData();
    } catch (err) {
      toast.error("Purge Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RECENT COLLECTIONS ================= */
  const fetchRecentCollections = async () => {
    try {
      const payRes = await axios.get("http://localhost:5002/api/v3/Admin/Payment/history", { withCredentials: true });
      if (payRes.data.payments) setRecentPayments(payRes.data.payments.slice(0, 15)); // Show last 15
    } catch (e) {
      console.error("Payment History Load Failed", e);
    }
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  /* ================= CALCULATION ================= */
  const selectedCourse = feeStructures.find(f => 
    f.course?.toLowerCase() === student?.course?.toLowerCase() &&
    f.batch?.toLowerCase() === student?.batch?.toLowerCase()
  ) || {
    academicFee: 0, transportFee: 18000,
    examinationFee: 0, uniformFee: 0, otherFee: 0, totalFee: 18000
  };

  const grandTotal = selectedCourse.totalFee;

  return (
    <div className="relative -mt-6 md:-mt-12">
      {loading && <Loader />}

      {/* 🏛️ Professional Header Bar */}
      <div className="py-6 px-4 md:px-0">
        <div className="w-full mx-auto flex justify-start">
          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/40 border border-slate-100 p-3 md:p-4 w-[98%] mx-auto md:w-[90%] lg:w-[80%] flex flex-row items-center justify-between gap-3 md:gap-6 transition-all">
            
            <div className="hidden sm:block space-y-1">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Fee Registry
              </h2>
              <p className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2 mt-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                Institutional Fee Audit v4.0
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
              <button
                onClick={() => navigate("/fee-payments")}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100 shadow-sm shadow-indigo-100"
                title="Go to Fee Submission"
              >
                <FiCreditCard size={18} />
                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">Fee Submission</span>
              </button>



              <div className="relative group flex-1 max-w-[280px] min-w-[120px]">
                <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors text-xs md:text-base" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ID: ITM/..."
                  className="w-full pl-9 md:pl-11 pr-4 py-2.5 md:py-3 bg-white border-none rounded-lg md:rounded-lg text-[10px] md:text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 italic"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 md:px-8 py-2.5 md:py-3 bg-[#0f172a] text-white rounded-lg md:rounded-lg font-black uppercase tracking-widest text-[9px] md:text-[10px] italic shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="hidden md:inline">Access Registry</span>
                <span className="md:hidden">Access</span>
                <FiArrowRight size={14} className="hidden xs:block" />
              </button>
              {student && (
                <button
                  onClick={() => { setStudent(null); setSearchId(""); }}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Clear"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {student ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 relative">
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
            <FiBookOpen size={600} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12" />
          </div>

          <div className="w-full mx-auto px-2 md:px-4 relative z-10">
            <div className="w-[98%] mx-auto md:w-full h-[490px] overflow-y-auto bg-white border-[1px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm p-1 custom-scrollbar">
              <div className="border-[0.5px] border-slate-900/30 p-4 md:p-6 relative overflow-hidden">
                <div className="text-center space-y-1 mb-6 relative">
                  <h1 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    Institute of Technology & Management
                  </h1>
                  <div className="flex items-center justify-center gap-2 md:gap-4">
                    <div className="h-[1px] w-6 md:w-12 bg-slate-200"></div>
                    <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em] italic">
                      Academic Fee Registry | {student.batch}
                    </p>
                    <div className="h-[1px] w-6 md:w-12 bg-slate-200"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4 mb-6 md:mb-8">
                  {[
                    { label: "Full Name", value: student.studentName },
                    { label: "Registration ID", value: student.studentId },
                    { label: "Course / Stream", value: student.course },
                    { label: "Batch", value: student.batch },
                    { label: "Affiliated University", value: student.university || "AKTU, Lucknow" },
                    { label: "Student Category", value: "Day Scholar" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col border-b border-slate-50 pb-1 md:pb-2">
                      <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1 italic">
                        {item.label}
                      </span>
                      <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-[2px] border-slate-900 overflow-hidden mb-6 md:mb-8 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white border-b-2 border-slate-900">
                        <th className="p-2 md:p-4 text-left text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Particulars</th>
                        <th className="p-2 md:p-4 text-right text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-black">
                      {[
                        { name: "Institutional Tuition Fee", amount: selectedCourse.academicFee },
                        { name: "Transit & Logistic Charges", amount: selectedCourse.transportFee },
                        { name: "Examination Appraisal", amount: selectedCourse.examinationFee },
                        { name: "Identity & Uniform Essentials", amount: selectedCourse.uniformFee },
                        { name: "Other Miscellaneous Cost", amount: selectedCourse.otherFee }
                      ].map((row, i) => (
                        <tr key={i} className="group hover:bg-white/50 transition-colors">
                          <td className="p-2 md:p-4 border-r-2 border-slate-900">
                            <p className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-tighter">
                              {row.name}
                            </p>
                          </td>
                          <td className="p-2 md:p-4 text-right text-xs md:text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
                            ₹ {row.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/70 border-t-2 border-slate-900">
                        <td className="p-3 md:p-5 border-r-2 border-slate-900">
                          <p className="text-[10px] md:text-sm font-black text-emerald-900 uppercase tracking-widest italic">Aggregate Total</p>
                        </td>
                        <td className="p-3 md:p-5 text-right">
                          <p className="text-base md:text-2xl font-black text-emerald-900 tracking-tighter whitespace-nowrap">
                            ₹ {grandTotal.toLocaleString()} /-
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pt-2 md:pt-4">
                  <div className="max-w-md">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-wider">
                      * Document details the session {student.batch} standards. Registration/exam charges processed per actuals.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-2 self-end md:self-auto">
                    <div className="w-24 md:w-40 border-b-2 border-slate-200"></div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-900 uppercase tracking-tighter italic">
                      Registry Authority Seal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mx-auto flex justify-center md:justify-end gap-4 mt-8 md:mt-12">
              <button
                onClick={handlePrint}
                className="group flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-slate-900 text-white rounded-lg shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto justify-center"
              >
                <FiPrinter size={18} className="group-hover:rotate-6 transition-transform" />
                <div className="text-left">
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Export Registry</p>
                  <p className="text-xs md:text-base font-black italic tracking-tighter">Generate Official Copy</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] py-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0"></div>
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
            {/* Recent Submissions Section */}
            <div className="w-full max-w-[98%] mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiActivity size={14} className="text-indigo-500" />
                    Filtered Fee Collections
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        fetchRecentCollections();
                        toast.info("Registry Synced", { ...toststyle, autoClose: 1000 });
                      }}
                      className="p-1.5 hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 rounded-lg transition-all"
                      title="Sync Latest Submissions"
                    >
                      <FiActivity className="animate-spin-slow" size={14} />
                    </button>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded italic">Live Registry</span>
                  </div>
                </h4>

                {/* Filter Controls */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <select 
                    value={activeFilters.course}
                    onChange={(e) => setActiveFilters({...activeFilters, course: e.target.value})}
                    className="bg-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tight outline-none focus:ring-1 focus:ring-indigo-500 border-none cursor-pointer"
                  >
                    <option value="">All Courses</option>
                    {registry.courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  <select 
                    value={activeFilters.semester}
                    onChange={(e) => setActiveFilters({...activeFilters, semester: e.target.value})}
                    className="bg-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tight outline-none focus:ring-1 focus:ring-indigo-500 border-none cursor-pointer"
                  >
                    <option value="">All Semesters</option>
                    {registry.semesters.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                  <select 
                    value={activeFilters.batch}
                    onChange={(e) => setActiveFilters({...activeFilters, batch: e.target.value})}
                    className="bg-white px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-tight outline-none focus:ring-1 focus:ring-indigo-500 border-none cursor-pointer"
                  >
                    <option value="">All Batches</option>
                    {registry.batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                
                <div className="space-y-3">
                  {recentPayments
                    .filter(p => {
                      const courseMatch = !activeFilters.course || p.course?.toLowerCase() === activeFilters.course.toLowerCase();
                      const semMatch = !activeFilters.semester || p.semester?.toString().includes(activeFilters.semester.toString());
                      const batchMatch = !activeFilters.batch || p.academicYear?.toLowerCase() === activeFilters.batch.toLowerCase();
                      return courseMatch && semMatch && batchMatch;
                    })
                    .length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <FiFileText className="text-slate-200" />
                      </div>
                      <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest italic">No transactions indexed yet</p>
                    </div>
                  ) : (
                    recentPayments.map((p) => (
                      <div key={p._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-default">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-black italic shadow-sm group-hover:scale-110 transition-transform">
                            {p.studentName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-black text-slate-900 uppercase italic leading-none">{p.studentName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.studentId} • {p.paymentType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-indigo-600 italic">₹{p.amount.toLocaleString()}</p>
                          <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
            <form onSubmit={handlePublish}>
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Publish Fee Structure</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registry Configuration Portal</p>
                </div>
                <button type="button" onClick={() => setShowPublishModal(false)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900">
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Registry Selectors */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Department</label>
                  <select 
                    required value={publishForm.department}
                    onChange={(e) => setPublishForm({...publishForm, department: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {registry.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Academic Course</label>
                  <select 
                    required value={publishForm.course}
                    onChange={(e) => setPublishForm({...publishForm, course: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Course</option>
                    {registry.courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Temporal Batch</label>
                  <select 
                    required value={publishForm.batch}
                    onChange={(e) => setPublishForm({...publishForm, batch: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Batch</option>
                    {registry.batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>

                {/* Fee Components */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Academic Fee (₹)</label>
                  <input type="number" required value={publishForm.academicFee} onChange={(e) => setPublishForm({...publishForm, academicFee: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Transport Fee (₹)</label>
                  <input type="number" value={publishForm.transportFee} onChange={(e) => setPublishForm({...publishForm, transportFee: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Examination Fee (₹)</label>
                  <input type="number" value={publishForm.examinationFee} onChange={(e) => setPublishForm({...publishForm, examinationFee: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Uniform Fee (₹)</label>
                  <input type="number" value={publishForm.uniformFee} onChange={(e) => setPublishForm({...publishForm, uniformFee: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Other Charges (₹)</label>
                  <input type="number" value={publishForm.otherFee} onChange={(e) => setPublishForm({...publishForm, otherFee: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  className="px-12 py-4 bg-emerald-600 text-white rounded-lg font-black uppercase tracking-widest text-[11px] italic shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Confirm Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Print Content */}
      <div className="hidden">
        {student && (
          <div ref={printRef} className="p-10 font-sans text-xs italic">
            <div className="text-center border-b-2 border-black pb-6 mb-8">
              <h1 className="text-2xl font-black uppercase tracking-tighter">Institute of Technology & Management</h1>
              <p className="uppercase tracking-[0.2em] font-bold mt-2">GIDA, Gorakhpur - Academic Fee Structure</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8 uppercase font-bold">
              <p>Student: {student.studentName}</p>
              <p className="text-right">Reg ID: {student.studentId}</p>
              <p>Course: {student.course}</p>
              <p className="text-right">Batch: {student.batch}</p>
            </div>
            <table className="w-full border-2 border-black">
              <thead>
                <tr className="bg-white uppercase border-b-2 border-black font-black">
                  <th className="p-2 text-left border-r-2 border-black">Fee Descriptions</th>
                  <th className="p-2 text-right">Value (₹)</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {[
                  { n: "Academic Fee", a: selectedCourse.academicFee },
                  { n: "Transport Fee", a: selectedCourse.transportFee },
                  { n: "Examination Fee", a: selectedCourse.examinationFee },
                  { n: "Uniform Fee", a: selectedCourse.uniformFee },
                  { n: "Other Charges", a: selectedCourse.otherFee }
                ].map((item, i) => (
                  <tr key={i} className="border-b border-black">
                    <td className="p-2 border-r-2 border-black">{item.n}</td>
                    <td className="p-2 text-right">{item.a.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-white text-lg border-t-2 border-black font-black italic">
                  <td className="p-3 border-r-2 border-black uppercase">Aggregate Total</td>
                  <td className="p-3 text-right">₹ {grandTotal.toLocaleString()} /-</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-20 flex justify-end">
              <div className="text-center border-t-2 border-black pt-2 px-8 font-black uppercase italic tracking-widest">
                Authorized Signatory
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feestructure;
