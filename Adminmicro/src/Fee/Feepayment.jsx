import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  FiSearch,
  FiPrinter,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiCreditCard,
  FiHash,
  FiArrowRight,
  FiActivity,
  FiX
} from "react-icons/fi";
import { authAPI, ReportAPI } from "../api/apis";

const Feepayment = () => {
  const printRef = useRef();

  /* ================= STATES ================= */
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feeType, setFeeType] = useState("Academic");

  // Auto-refresh data when feeType changes for a selected student
  useEffect(() => {
    if (student) {
      handleSearch(feeType);
    }
  }, [feeType]); // Academic or Hostel

  // Payment States
  const [payAmount, setPayAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [paidCash, setPaidCash] = useState(0);
  const [paidOnline, setPaidOnline] = useState(0);
  const [receipt, setReceipt] = useState(null);

  // Silent Initial Data Fetch
  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await ReportAPI.get("/Fee/structure");
        if (response.data.structures) setFeeStructures(response.data.structures);
      } catch (err) { console.error(err); }
    };
    fetchStructures();
  }, []);

  /* ================= SEARCH ================= */
  const handleSearch = async (overrideType = null) => {
    const currentType = overrideType || feeType;
    try {
      setLoading(true);
      setError("");
      
      // 🔹 Fetch from AUTH Registry as requested
      const response = await authAPI.get("/StudentList");
      const studentsList = response.data.studentList || [];
      
      const normalizedSearch = searchId.trim().toLowerCase();
      
      let data = studentsList.find(s => 
        (s.studentId && s.studentId.trim().toLowerCase() === normalizedSearch) ||
        (s.rollNo && s.rollNo.trim().toLowerCase() === normalizedSearch) ||
        (s.email && s.email.trim().toLowerCase() === normalizedSearch) ||
        (s.moNumber && String(s.moNumber).trim() === normalizedSearch)
      );

      // Fallback: Check Academic Registry if not found in Auth
      if (!data) {
        const acadRes = await ReportAPI.get("/Academic/students");
        const acadList = acadRes.data.data || [];
        data = acadList.find(s => 
            (s.rollNo && s.rollNo.trim().toLowerCase() === normalizedSearch) ||
            (s.studentId && s.studentId.trim().toLowerCase() === normalizedSearch)
        );
      }

      if (!data) {
        setError(`Record "${searchId}" not indexed in any Registry`);
        setStudent(null);
        return;
      }

      // 🔹 Integrated Hostel Check from Student Profile
      if (currentType === "Hostel" && !data.isHostel) {
        setError("This student is not registered for Hostel facilities in their profile.");
        setStudent(null);
        return;
      }

      // Fetch specific fee structure from WORK service (v3)
      let structure = { academicFee: 60000, hostelFee: 65000 };
      try {
        const structRes = await ReportAPI.get(`/Fee/structure/specific?department=${data.department || data.course}&course=${data.course}&batch=${data.batch}`);
        if (structRes.data.structure) structure = structRes.data.structure;
      } catch (fErr) {
        console.warn("Fee Structure missing, using default", fErr);
      }

      setStudent({
        ...data,
        name: data.name || data.studentName,
        totalFee: currentType === "Academic" 
          ? (data.academicFee || structure.academicFee || 60000) 
          : (data.hostelFee || structure.hostelFee || 65000),
        feeStructureMissing: !structure._id && !data.academicFee
      });

      // Fetch payment history from WORK service (v3)
      let hisPayments = [];
      try {
        const payRes = await ReportAPI.get(`/Payment/history?studentId=${data.studentId || data.rollNo}&type=${currentType}`);
        if (payRes.data.payments) hisPayments = payRes.data.payments;
      } catch (pErr) {
        console.warn("Payment history fetch failed", pErr);
      }

      const total = hisPayments.reduce((acc, p) => acc + p.amount, 0);
      setPaidCash(total); 
      setPaidOnline(0); 

      setError("");
    } catch (err) {
      console.error("Search Logic Error:", err);
      setError("Search Failed: " + (err.response?.data?.message || "Internal Registry Error"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH SCREEN ================= */
  if (!student) {
    return (
      <div className="flex justify-center items-start pt-10 md:pt-20 min-h-[80vh] px-4">
        {loading && <Loader />}
        <div className="bg-white w-full max-w-2xl p-6 md:p-10 rounded-2xl shadow-2xl shadow-gray-200/50 border border-slate-100 animate-in zoom-in-95 duration-500 relative">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner border border-blue-100/50">
              <FiCreditCard size={32} className="animate-pulse" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
              Fee <span className="text-blue-600">Payment</span>
            </h2>
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 italic">
              Institutional Financial Registry v4.5
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={`Enter Student ID (e.g. ITM/...)`}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-slate-100 rounded-xl text-xs md:text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-wider italic flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-[#0f172a] text-white py-4 md:py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] italic flex items-center justify-center gap-3 hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-gray-900/20"
              >
                {loading ? "Searching Registry..." : "Access Account"}
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPaid = paidOnline + paidCash;
  const pending = student.totalFee - totalPaid;
  const today = new Date().toLocaleDateString("en-GB");

  /* ================= PAYMENT ================= */
  const handlePay = async () => {
    const amountToPay = Number(payAmount);

    if (!paymentMode) return toast.error("Select payment mode");
    if (!amountToPay || amountToPay <= 0) return toast.error("Enter valid amount");
    if (amountToPay > pending) return toast.error("Amount exceeds pending fee");

    try {
      setLoading(true);
      const res = await ReportAPI.post("/Payment/record", {
        studentId: student.studentId || student.rollNo || student._id,
        studentName: student.name,
        course: student.course || "GENERAL",
        semester: String(student.semester || "1"),
        academicYear: student.year || student.batch || "2024-25",
        paymentType: feeType,
        amount: amountToPay,
        paymentMethod: paymentMode === "ONLINE" ? "Online" : "Cash",
        transactionId: paymentMode === "ONLINE" ? `TXN_${Date.now()}` : null,
        remark: `${feeType} Fee Paid${feeType === "Hostel" ? ` (Room: ${student.roomNo || "N/A"})` : ""}`
      });

      if (paymentMode === "ONLINE") setPaidOnline(paidOnline + amountToPay);
      else setPaidCash(paidCash + amountToPay);

      setReceipt({
        date: today,
        amount: amountToPay,
        mode: paymentMode,
      });

      setPayAmount("");
      toast.success(`${feeType} Fee Recorded Successfully`);
    } catch (err) {
      console.error("Submission Error:", err);
      const msg = err.response?.data?.message || "Transaction Failed";
      toast.error(msg);
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

  const statCards = [
    { label: `${feeType} Assessment`, value: `₹${(student.totalFee || 0).toLocaleString()}`, icon: FiDollarSign, color: "blue" },
    { label: "Total Realized", value: `₹${(totalPaid || 0).toLocaleString()}`, icon: FiCheckCircle, color: "emerald" },
    { label: "Pending Dues", value: `₹${(pending || 0).toLocaleString()}`, icon: FiClock, color: "red" },
  ];

  return (
    <div className="relative -mt-6 md:-mt-12 pb-12 w-full mx-auto px-4 md:px-6">
      {loading && <Loader />}

      {/* 🏛️ Professional Header Bar */}
      <div className="py-4 md:py-6">
        <div className="w-full flex justify-center">
          <div className="bg-white rounded-xl shadow-xl shadow-gray-200/40 border border-slate-100 p-4 w-full md:w-[95%] lg:w-[90%] flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
            
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-blue-600 shadow-inner">
                <FiActivity size={18} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                  Payment Ledger
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  {["Academic", "Hostel"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFeeType(type)}
                      className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                        feeType === type 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                          : "bg-gray-100 text-gray-400 hover:text-gray-600 border border-slate-100/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto md:justify-end">
              <div className="relative group flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors text-xs" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ID: ITM/..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-slate-100 rounded-lg text-[10px] md:text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all placeholder:text-gray-300 italic"
                />
              </div>
              {student && (
                <button
                  onClick={() => { setStudent(null); setSearchId(""); }}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {student ? (
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Professional Header - Compact */}
          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/40 border border-slate-100 overflow-hidden relative">
            <div className="h-20 bg-gradient-to-r from-gray-900 via-[#111111] to-blue-900 absolute top-0 left-0 w-full opacity-[0.03]"></div>
            <div className="relative p-6">
              {student.feeStructureMissing && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3 text-amber-700 animate-pulse">
                   <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest">Warning: No fee structure published for this course/batch. Using default estimate.</p>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-blue-600 text-xl font-black italic shadow-inner border border-blue-100">
                    {student.name[0]}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
                      {student.name}
                    </h1>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5 italic flex items-center gap-2">
                      <FiActivity className="text-blue-600" />
                      {student.course} • Sem {student.semester}nd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-16 h-16 -mt-4 -mr-4 bg-${card.color}-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative flex items-center gap-4">
                  <div className={`w-10 h-10 bg-${card.color === 'emerald' ? 'emerald' : card.color === 'red' ? 'red' : 'blue'}-50 rounded-lg flex items-center justify-center text-${card.color === 'emerald' ? 'emerald' : card.color === 'red' ? 'red' : 'blue'}-600`}>
                    <card.icon size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-0.5">{card.label}</p>
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter italic">{card.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#111111] p-10 rounded-lg shadow-2xl text-white relative overflow-hidden w-[98%] mx-auto lg:w-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
              <h2 className="text-sm font-black uppercase italic tracking-[0.2em] mb-10 flex items-center gap-3">
                <FiCreditCard className="text-blue-500" />
                Initialize Transaction
              </h2>

              <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Select Resource Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["CASH", "ONLINE"].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`py-4 rounded-lg border ${paymentMode === mode ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/5 hover:bg-white/10'} text-[10px] font-black uppercase tracking-widest transition-all italic`}
                      >
                        {mode} Access
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Resource Amount (INR)</label>
                  <input
                    type={pending <= 0 ? "text" : "number"}
                    value={pending <= 0 ? "DUES CLEAR" : payAmount}
                    readOnly={pending <= 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > pending) {
                        setPayAmount(pending);
                        toast.warn(`Amount capped at pending dues: ₹${pending}`, { theme: "dark" });
                      } else {
                        setPayAmount(e.target.value);
                      }
                    }}
                    placeholder={pending <= 0 ? "Balance Settled" : "Enter payment value..."}
                    className={`w-full bg-white/5 border border-white/5 rounded-lg px-6 py-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-white/20 italic ${pending <= 0 ? "text-emerald-400 cursor-not-allowed border-emerald-500/20" : "text-white"}`}
                  />
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading || pending <= 0 || !payAmount || Number(payAmount) <= 0}
                  className={`w-full py-5 rounded-lg font-black uppercase tracking-[0.3em] text-[11px] italic transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                    pending <= 0 
                      ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-not-allowed" 
                      : "bg-white text-black hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {pending <= 0 ? "Account Settled" : "Execute Payment"}
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Receipt Preview / Details */}
            <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-100 flex flex-col justify-between w-[98%] mx-auto lg:w-full">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-[0.2em] mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Student Registry Info
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-2 italic">
                  {[
                    { label: "Full Legal Name", value: student.name },
                    { label: "Course / Degree", value: student.course },
                    { label: "Temporal Batch", value: student.batch },
                    { label: "Semester Unit", value: student.semester },
                    { label: "Section / Group", value: student.section || "N/A" },
                    { label: "Roll Number", value: student.rollNo || "N/A" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1 border-b border-slate-50 pb-2">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.label}</p>
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {receipt && (
                <div className="mt-10 animate-in slide-in-from-bottom duration-500">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                        <FiCheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Txn Successful</p>
                        <p className="text-xs font-black text-emerald-900 uppercase italic">₹{receipt.amount.toLocaleString()} Processed</p>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95 italic"
                    >
                      <FiPrinter className="inline mr-2" />
                      Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in-95 duration-700">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-gray-200 border border-slate-50">
            <FiCreditCard className="text-gray-200" size={48} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest">Awaiting Financial Access</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 italic">Search for a student account to manage payments</p>
          </div>
        </div>
      )}

      {/* 🔹 Print Fragment (Hidden) */}
      <div className="hidden">
        {receipt && (
          <div ref={printRef} className="p-10 font-sans italic opacity-80 scale-95 origin-top">
            {["Student Receipt", "Institutional Copy"].map((copy, i) => (
              <div key={i} className="mb-20">
                <div className="text-center border-b-2 border-black pb-6 mb-8 uppercase">
                  <h1 className="text-3xl font-black tracking-tighter italic">ITM College of Management</h1>
                  <p className="text-[10px] tracking-[0.3em] font-bold mt-2">AL-1, Sector-7, GIDA, Gorakhpur - 273209</p>
                  <div className="mt-4 px-6 py-1 bg-black text-white inline-block text-[10px] font-black tracking-widest italic">
                    Transaction Receipt ({copy})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 font-black uppercase text-[11px]">
                  <p>Ref: GEN-TXN-{Date.now()}</p>
                  <p className="text-right">Date: {receipt?.date}</p>
                  <p>Registrar ID: {student.studentId}</p>
                  <p className="text-right">Session: 2024-25</p>
                </div>

                <div className="border-2 border-black p-8 italic font-bold">
                  <div className="grid grid-cols-2 gap-y-4 text-xs">
                    <p className="border-b border-slate-100 pb-2">Student Identity:</p>
                    <p className="border-b border-slate-100 pb-2 text-right">{student.name}</p>
                    <p className="border-b border-slate-100 pb-2">Father Name:</p>
                    <p className="border-b border-slate-100 pb-2 text-right">{student.father}</p>
                    <p className="border-b border-slate-100 pb-2">Academic Course:</p>
                    <p className="border-b border-slate-100 pb-2 text-right">{student.course}</p>
                    <p className="border-b border-slate-100 pb-2">Resource Resource:</p>
                    <p className="border-b border-slate-100 pb-2 text-right">{receipt?.mode}</p>
                    <p className="text-lg font-black uppercase mt-4">Total Realized:</p>
                    <p className="text-lg font-black mt-4 text-right">₹{receipt?.amount} /-</p>
                  </div>
                </div>

                <div className="mt-10 uppercase text-[9px] font-bold leading-relaxed max-w-lg">
                  <p>Disclaimer: This is a system-generated financial resource document. All processed fees are subject to institutional guidelines and are non-refundable & non-transferable under any circumstances.</p>
                </div>

                <div className="mt-20 flex justify-end">
                  <div className="border-t-2 border-black pt-2 px-10 text-center uppercase font-black text-[10px] italic">
                    Institutional Registry
                  </div>
                </div>

                {i === 0 && <div className="border-b-2 border-dashed border-gray-300 my-16 opacity-30"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Feepayment;




