import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { FiSearch, FiPrinter, FiBookOpen, FiUser, FiHash, FiMapPin, FiCalendar, FiArrowRight, FiX } from "react-icons/fi";

const Feestructure = () => {
  const printRef = useRef();

  /* ================= STATES ================= */
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Fee Structures on Load (Silent Load)
  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/v3/Admin/Fee/structure", { withCredentials: true });
        if (response.data.structures) setFeeStructures(response.data.structures);
      } catch (err) { console.error(err); }
    };
    fetchStructures();
  }, []);

  /* ================= SEARCH STUDENT ================= */
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      // Logic from provided code: fetch list and find by ID
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
        email: data.email,
        phone: data.phone || "N/A"
      });
    } catch (err) {
      setError("Server Error: Registry Unreachable");
    } finally {
      setLoading(false);
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
  const selectedCourse = feeStructures.find(f => f.courseName?.toLowerCase() === student?.course?.toLowerCase()) || {
    courseName: student?.course?.toUpperCase() || "N/A",
    academicFee: 0,
    examinationFee: 0,
    uniformFee: 0,
    hostelFee: 0,
    transportFee: 18000
  };

  const transportFee = selectedCourse.transportFee || 18000;
  const grandTotal = selectedCourse.academicFee + transportFee;

  return (
    <div className="relative -mt-6 md:-mt-12">
      {loading && <Loader />}

      {/* 🏛️ Professional Header Bar (Inspired by Directory Style) */}
      <div className="py-6 px-4 md:px-0">
        <div className="w-full mx-auto flex justify-start">
          <div className="bg-white rounded-[12px] shadow-xl shadow-gray-200/40 border border-gray-100 p-3 md:p-4 w-[98%] mx-auto md:w-[90%] lg:w-[80%] flex flex-row items-center justify-between gap-3 md:gap-6 transition-all">

            {/* Left: Identity & Description (Hidden on extra small mobile) */}
            <div className="hidden sm:block space-y-1">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Fee Registry
              </h2>
              <p className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2 mt-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                Institutional Fee Audit v3.0
              </p>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
              <div className="relative group flex-1 max-w-[280px] min-w-[120px]">
                <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors text-xs md:text-base" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ID: ITM/..."
                  className="w-full pl-9 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 italic"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 md:px-8 py-2.5 md:py-3 bg-[#0f172a] text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] italic shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="hidden md:inline">Access Registry</span>
                <span className="md:hidden">Access</span>
                <FiArrowRight size={14} className="hidden xs:block" />
              </button>
              {student && (
                <button
                  onClick={() => { setStudent(null); setSearchId(""); }}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
        <div className="animate-in fade-in  slide-in-from-bottom-6 duration-1000  relative">

          {/* 🏛️ Premium Document Background / Watermark */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
            <FiBookOpen size={600} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12" />
          </div>

          <div className="w-full mx-auto px-2 md:px-4 relative z-10">
            {/* The Main Formal Card - 600px Height with Internal Scroll */}
            <div className="w-[98%] mx-auto md:w-full h-[490px] overflow-y-auto bg-white border-[1px] border-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm p-1 custom-scrollbar">

              {/* Inner Decorative Border - Compact Padding */}
              <div className="border-[0.5px] border-slate-900/30 p-4 md:p-6 relative overflow-hidden">

                {/* Organizational Watermark (Small Seal) - Hidden on mobile for space */}
                <div className="absolute top-10 right-10 opacity-10 rotate-12 hidden lg:block">
                  <div className="w-24 h-24 border-4 border-double border-slate-900 rounded-full flex items-center justify-center p-2 text-center text-[8px] font-black leading-tight uppercase tracking-tighter">
                    Official Institutional<br />Registry<br />2024-25
                  </div>
                </div>

                <div className="text-center space-y-1 mb-6 relative">
                  <h1 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                    Institute of Technology & Management
                  </h1>
                  <div className="flex items-center justify-center gap-2 md:gap-4">
                    <div className="h-[1px] w-6 md:w-12 bg-slate-200"></div>
                    <p className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em] italic">
                      Academic Fee Registry | 2024-25
                    </p>
                    <div className="h-[1px] w-6 md:w-12 bg-slate-200"></div>
                  </div>
                </div>

                {/* Student Identity Grid - Compact Spacing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4 mb-6 md:mb-8">
                  {[
                    { label: "Full Name", value: student.studentName },
                    { label: "Registration ID", value: student.studentId },
                    { label: "Course / Stream", value: student.course },
                    { label: "Academic Semester", value: `${student.semester}nd Semester` },
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

                {/* Formal Financial Ledger */}
                <div className="border-[2px] border-slate-900 overflow-hidden mb-6 md:mb-8 shadow-sm">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b-2 border-slate-900">
                        <th className="p-2 md:p-4 text-left text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Particulars</th>
                        <th className="p-2 md:p-4 text-right text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-black">
                      {[
                        { name: "Institutional Tuition Fee", amount: selectedCourse.academicFee },
                        { name: "Transit & Logistic Charges", amount: transportFee },
                        { name: "Examination Appraisal", amount: "Variable", italic: true, opacity: 0.4 },
                        { name: "Identity & Uniform Essentials", amount: "Variable", italic: true, opacity: 0.4 }
                      ].map((row, i) => (
                        <tr key={i} className={`group hover:bg-slate-50/50 transition-colors ${row.opacity ? 'opacity-40' : ''}`}>
                          <td className="p-2 md:p-4 border-r-2 border-slate-900">
                            <p className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-tighter">
                              {row.name}
                            </p>
                            {row.italic && <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase italic leading-none mt-0.5">Variable Cost</p>}
                          </td>
                          <td className="p-2 md:p-4 text-right text-xs md:text-sm font-black text-slate-900 tracking-tight whitespace-nowrap">
                            {typeof row.amount === 'number' ? `₹ ${row.amount.toLocaleString()}` : row.amount}
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

                {/* Official Disclaimer & Verification */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pt-2 md:pt-4">
                  <div className="max-w-md">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-wider">
                      * Document details the session 2024-25 standards. Registration/exam charges processed per actuals.
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

            {/* Premium Action Footer */}
            <div className="w-full mx-auto flex justify-center md:justify-end gap-4 mt-8 md:mt-12 animate-in slide-in-from-right-10 duration-1000 delay-300">
              <button
                onClick={handlePrint}
                className="group flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 bg-slate-900 text-white rounded-xl shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto justify-center"
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
        <div className="min-h-[65vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000 relative">

          {/* Decorative Grid Background for Placeholder */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0"></div>

          <div className="relative z-10 space-y-8 max-w-lg mx-auto">
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-900/5 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full shadow-2xl flex items-center justify-center border border-slate-100">
                <FiSearch className="text-slate-900" size={40} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                Registry Awaiting Input
              </h3>
              <div className="flex items-center justify-center gap-2">
                <div className="h-[2px] w-8 bg-slate-200"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                  Institutional Fee Audit v3.0
                </p>
                <div className="h-[2px] w-8 bg-slate-200"></div>
              </div>
              <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto leading-relaxed">
                Enter a unique student registration identification to visualize, verify, and export the official academic fee structure.
              </p>
            </div>
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
              <p className="text-right">Semester: {student.semester}</p>
            </div>

            <table className="w-full border-2 border-black">
              <thead>
                <tr className="bg-gray-100 uppercase border-b-2 border-black font-black">
                  <th className="p-2 text-left border-r-2 border-black">Fee Descriptions</th>
                  <th className="p-2 text-right">Value (₹)</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                <tr className="border-b border-black">
                  <td className="p-2 border-r-2 border-black">Tuition & Academic Fee</td>
                  <td className="p-2 text-right">{selectedCourse.academicFee}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 border-r-2 border-black">Transport Facility Fee</td>
                  <td className="p-2 text-right">{transportFee}</td>
                </tr>
                <tr className="bg-gray-100 text-lg border-t-2 border-black font-black italic">
                  <td className="p-3 border-r-2 border-black uppercase">Aggregate Total</td>
                  <td className="p-3 text-right">₹ {grandTotal} /-</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-10 uppercase text-[10px] leading-relaxed">
              <p>1. Fees once paid are non-refundable and non-transferable.</p>
              <p>2. Subject to AKTU/BTE guidelines where applicable.</p>
            </div>

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
