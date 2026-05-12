import React, { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import { AcademicAPI, ReportAPI, WorkAPI } from "../../api/apis";
import {
  FiSearch, FiPrinter, FiDollarSign, FiCheckCircle, FiClock,
  FiUser, FiCreditCard, FiHash, FiArrowRight, FiActivity, FiX, FiHome
} from "react-icons/fi";

const FeeSubmission = () => {
  const [activeTab, setActiveTab] = useState("Academic"); // Academic or Hostel
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch students from Admin Registry
      const response = await AcademicAPI.get("/students");
      const studentsList = response.data.data || [];
      const data = studentsList.find(s => s.rollNo?.trim().toLowerCase() === searchId.trim().toLowerCase() || s.studentId?.trim().toLowerCase() === searchId.trim().toLowerCase());

      if (!data) {
        setError("Student not found in Registry");
        setStudent(null);
        return;
      }

      let totalFee = 60000;
      if (activeTab === "Academic") {
        const structRes = await AcademicAPI.get(`/Fee/structure/specific?department=${data.department}&course=${data.course}&batch=${data.batch}`);
        totalFee = structRes.data.structure?.academicFee || 60000;
      } else {
        // Hostel Fee logic
        const structRes = await AcademicAPI.get(`/Fee/structure/specific?department=${data.department}&course=${data.course}&batch=${data.batch}`);
        totalFee = structRes.data.structure?.hostelFee || 65000;
      }

      setStudent({
        ...data,
        name: data.name || data.studentName,
        totalFee: totalFee
      });

      // Fetch history
      const payRes = await ReportAPI.get(`/Payment/history?studentId=${data.rollNo || data.studentId}&type=${activeTab}`);
      const history = payRes.data.payments || [];
      const totalPaid = history.reduce((acc, p) => acc + p.amount, 0);
      setPaidAmount(totalPaid);

      setError("");
    } catch (err) {
      setError("Search Failed: Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    const payValue = Number(amount);
    if (!payValue || payValue <= 0) return toast.error("Enter valid amount");
    if (payValue > (student.totalFee - paidAmount)) return toast.error("Amount exceeds balance");

    try {
      setLoading(true);
      await ReportAPI.post("/Payment/record", {
        studentId: student.rollNo || student.studentId,
        studentName: student.name,
        course: student.course,
        semester: student.semester,
        academicYear: student.year || "2024-25",
        paymentType: activeTab,
        amount: payValue,
        paymentMethod: paymentMode,
        remark: `${activeTab} Fee Submission`
      });

      setPaidAmount(paidAmount + payValue);
      setReceipt({
        date: new Date().toLocaleDateString(),
        amount: payValue,
        mode: paymentMode,
        type: activeTab
      });
      setAmount("");
      toast.success(`${activeTab} Fee Recorded`);
    } catch (err) {
      toast.error("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-24 pb-20 px-4 md:px-8">
      {loading && <Loader />}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Fee Collection Portal
            </h1>
          </div>
          
          <div className="flex bg-white p-1 rounded-[10px] shadow-sm border border-slate-100">
            {["Academic", "Hostel"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setStudent(null); setSearchId(""); }}
                className={`px-8 py-2 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {!student ? (
          <div className="bg-white rounded-[10px] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 md:p-20 text-center max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
            <div className={`w-24 h-24 rounded-[10px] flex items-center justify-center mx-auto mb-8 shadow-sm border transition-colors ${activeTab === 'Academic' ? 'bg-white border border-slate-100 border-slate-100 text-indigo-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
              {activeTab === 'Academic' ? <FiCreditCard size={40} /> : <FiHome size={40} />}
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
              {activeTab} <span className={activeTab === 'Academic' ? 'text-indigo-600' : 'text-emerald-600'}>Ledger</span>
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Scan or enter Student ID to proceed</p>
            
            <div className="relative max-w-md mx-auto group">
              <FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="REGISTRATION / ROLL NO"
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100  rounded-[10px] text-sm font-black focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-200 uppercase"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase italic hover:bg-indigo-600 transition-all shadow-lg"
              >
                Verify
              </button>
            </div>
            {error && <p className="mt-4 text-rose-500 text-[10px] font-black uppercase tracking-widest italic">{error}</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Student Info Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[10px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className={`h-24 ${activeTab === 'Academic' ? 'bg-indigo-600' : 'bg-emerald-600'} opacity-10`}></div>
                <div className="px-8 pb-8 -mt-12 text-center">
                   <div className="w-24 h-24 bg-white rounded-[10px] shadow-lg border border-slate-50 flex items-center justify-center mx-auto mb-6 text-3xl font-black italic text-slate-900">
                     {student.name[0]}
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{student.name}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">{student.course} • SEM {student.semester}</p>
                   
                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-slate-100 rounded-[10px] text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest mb-1">Total Fee</p>
                        <p className="text-sm font-black text-slate-900 tracking-tighter italic">₹{student.totalFee.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-white border border-slate-100 rounded-[10px] text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest mb-1">Outstanding</p>
                        <p className="text-sm font-black text-rose-600 tracking-tighter italic">₹{(student.totalFee - paidAmount).toLocaleString()}</p>
                      </div>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => { setStudent(null); setSearchId(""); }}
                className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic hover:text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center gap-3"
              >
                <FiX /> Switch Account
              </button>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-[10px] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white border border-slate-1000/5 rounded-full blur-3xl"></div>
                  <h2 className="text-sm font-black uppercase italic tracking-[0.3em] mb-12 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                    Initialize Collection
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Payment Mode</label>
                        <div className="grid grid-cols-3 gap-3">
                           {["Cash", "Online", "Bank"].map(mode => (
                             <button
                               key={mode}
                               onClick={() => setPaymentMode(mode)}
                               className={`py-3 rounded-[10px] text-[10px] font-black uppercase italic tracking-widest transition-all ${paymentMode === mode ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                             >
                               {mode}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Collection Amount (INR)</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="ENTER VALUE"
                          className="w-full px-6 py-4 bg-white border border-slate-100  rounded-[10px] text-sm font-black focus:ring-4 focus:ring-slate-900/5 transition-all italic"
                        />
                      </div>

                      <button
                        onClick={handlePay}
                        className="w-full py-5 bg-slate-900 text-white rounded-[10px] font-black uppercase tracking-[0.4em] text-[11px] italic shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4"
                      >
                        <FiSend /> Execute Transaction
                      </button>
                    </div>

                    <div className="flex flex-col justify-center items-center p-8 bg-white border border-slate-100 rounded-[10px] border border-slate-100 text-center">
                       {receipt ? (
                         <div className="animate-in fade-in zoom-in-95 duration-500">
                           <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                             <FiCheckCircle size={30} />
                           </div>
                           <h4 className="text-sm font-black text-slate-900 uppercase italic mb-1">Receipt Generated</h4>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Transaction ID: TXN-{Date.now().toString().slice(-6)}</p>
                           <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic hover:shadow-md transition-all">
                             <FiPrinter className="inline mr-2" /> Download Slip
                           </button>
                         </div>
                       ) : (
                         <div className="opacity-30">
                            <FiFileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Awaiting Submission</p>
                         </div>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )
      }
      </div>
    </div>
  );
};

const FiSend = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>

export default FeeSubmission;
