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

const Feepayment = () => {
  const printRef = useRef();

  /* ================= STATES ================= */
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paidOnline, setPaidOnline] = useState(0);
  const [paidCash, setPaidCash] = useState(0);
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);

  // Silent Initial Data Fetch
  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/v3/Admin/Fee/structure", { withCredentials: true });
        if (response.data.structures) setFeeStructures(response.data.structures);
      } catch (err) { console.error(err); }
    };
    fetchStructures();
  }, []);

  /* ================= SEARCH ================= */
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

      const structure = feeStructures.find(f => f.courseName?.toLowerCase() === data.course?.toLowerCase()) || { academicFee: 60000 };

      setStudent({
        ...data,
        totalFee: structure.academicFee + (structure.transportFee || 18000)
      });

      // Fetch his payments
      const payRes = await axios.get("http://localhost:5002/api/v3/Admin/Fee/payments", { withCredentials: true });
      const hisPayments = payRes.data.payments.filter(p => p.studentId === data.studentId);

      const online = hisPayments.filter(p => p.transactionId?.startsWith("ON")).reduce((acc, p) => acc + p.amountPaid, 0);
      const cash = hisPayments.filter(p => !p.transactionId?.startsWith("ON")).reduce((acc, p) => acc + p.amountPaid, 0);

      setPaidOnline(online);
      setPaidCash(cash);
      setError("");
    } catch (err) {
      setError("Search Failed: Registry Unreachable");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH SCREEN ================= */
  if (!student) {
    return (
      <div className=" flex justify-center items-center relative p-6">
        {loading && <Loader />}
        <div className="bg-white w-[98%] mx-auto md:w-full max-w-lg p-10 rounded-lg shadow-2xl shadow-gray-200/50 border border-gray-100 animate-in zoom-in-95 duration-500">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm">
              <FiCreditCard size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
              Fee <span className="text-blue-600">Payment</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">Process student fee transactions</p>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Registration ID"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-lg text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-300 italic"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-[10px] font-black uppercase tracking-wider italic flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              onClick={handleSearch}
              className="w-full bg-[#111111] text-white py-4 rounded-lg font-black uppercase tracking-[0.2em] text-[11px] italic flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
            >
              Access Account
              <FiArrowRight size={16} />
            </button>
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
    const payAmount = Number(amount);

    if (!paymentMode) return toast.error("Select payment mode");
    if (!payAmount || payAmount <= 0) return toast.error("Enter valid amount");
    if (payAmount > pending) return toast.error("Amount exceeds pending fee");

    try {
      setLoading(true);
      const txnId = paymentMode === "ONLINE" ? `ONLINE_${Date.now()}` : `CASH_${Date.now()}`;
      await axios.post("http://localhost:5002/api/v3/Admin/Fee/payments", {
        studentId: student.studentId,
        studentName: student.name,
        amountPaid: payAmount,
        transactionId: txnId,
        course: student.course,
        semester: student.semester
      }, { withCredentials: true });

      if (paymentMode === "ONLINE") setPaidOnline(paidOnline + payAmount);
      if (paymentMode === "CASH") setPaidCash(paidCash + payAmount);

      setReceipt({
        date: today,
        amount: payAmount,
        mode: paymentMode,
      });

      setAmount("");
      toast.success("Payment Recorded Successfully");
    } catch (err) {
      toast.error("Payment Failed to Save");
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
    { label: "Total Assessment", value: `₹${(student.totalFee || 0).toLocaleString()}`, icon: FiDollarSign, color: "blue" },
    { label: "Total Realized", value: `₹${(totalPaid || 0).toLocaleString()}`, icon: FiCheckCircle, color: "emerald" },
    { label: "Pending Dues", value: `₹${(pending || 0).toLocaleString()}`, icon: FiClock, color: "red" },
  ];

  return (
    <div className="relative -mt-6 md:-mt-12 pb-12 w-full mx-auto px-4 md:px-6">
      {loading && <Loader />}

      {/* 🏛️ Professional Header Bar (Inspired by Directory Style) */}
      <div className="py-6 px-4 md:px-0">
        <div className="w-full mx-auto flex justify-start">
          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/40 border border-gray-100 p-3 md:p-4 w-[98%] mx-auto md:w-[90%] lg:w-[80%] flex flex-row items-center justify-between gap-3 md:gap-6 transition-all">

            {/* Left: Identity & Description (Hidden on extra small mobile) */}
            <div className="hidden sm:block space-y-1">
              <h2 className="text-lg md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Payment Ledger
              </h2>
              <p className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2 mt-1">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Transaction Audit & Financial Logs
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
                  className="w-full pl-9 md:pl-11 pr-4 py-2.5 md:py-3 bg-white border-none rounded-lg md:rounded-lg text-[10px] md:text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300 italic"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 md:px-8 py-2.5 md:py-3 bg-[#0f172a] text-white rounded-lg md:rounded-lg font-black uppercase tracking-widest text-[9px] md:text-[10px] italic shadow-lg shadow-gray-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="hidden md:inline">Access Ledger</span>
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
        <div className="h-[450px] overflow-y-auto pr-2 custom-scrollbar space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Professional Header - Compact */}
          <div className="bg-white rounded-lg shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden relative">
            <div className="h-20 bg-gradient-to-r from-gray-900 via-[#111111] to-blue-900 absolute top-0 left-0 w-full opacity-[0.03]"></div>
            <div className="relative p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xl font-black italic shadow-inner border border-blue-100">
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
              <div key={idx} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm relative overflow-hidden group">
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
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter payment value..."
                    className="w-full bg-white/5 border border-white/5 rounded-lg px-6 py-4 text-sm font-black focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-white/20 italic"
                  />
                </div>

                <button
                  onClick={handlePay}
                  className="w-full py-5 bg-white text-black rounded-lg font-black uppercase tracking-[0.3em] text-[11px] italic hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  Execute Payment
                  <FiArrowRight />
                </button>
              </div>
            </div>

            {/* Receipt Preview / Details */}
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between w-[98%] mx-auto lg:w-full">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-[0.2em] mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Student Registry Info
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 pt-2 italic">
                  {[
                    { label: "Full Legal Name", value: student.name },
                    { label: "Father Name", value: student.father },
                    { label: "Course / Degree", value: student.course },
                    { label: "Mobile Contact", value: student.mobNumber || "N/A" },
                    { label: "Admission Mode", value: student.admissionMode },
                    { label: "Social Category", value: student.category },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{item.value}</p>
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
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-gray-200 border border-gray-50">
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
                    <p className="border-b border-gray-200 pb-2">Student Identity:</p>
                    <p className="border-b border-gray-200 pb-2 text-right">{student.name}</p>
                    <p className="border-b border-gray-200 pb-2">Father Name:</p>
                    <p className="border-b border-gray-200 pb-2 text-right">{student.father}</p>
                    <p className="border-b border-gray-200 pb-2">Academic Course:</p>
                    <p className="border-b border-gray-200 pb-2 text-right">{student.course}</p>
                    <p className="border-b border-gray-200 pb-2">Resource Resource:</p>
                    <p className="border-b border-gray-200 pb-2 text-right">{receipt?.mode}</p>
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




