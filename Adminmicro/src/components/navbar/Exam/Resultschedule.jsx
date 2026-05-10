import React, { useState, useRef } from "react";
import { ReportAPI } from "../../../api/apis";
import { toast } from "react-toastify";
import Loader from "../../Loader";

const Resultschedule = () => {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  const handleSearch = async () => {
    if (!rollNo.trim()) {
        toast.error("Please enter a roll number");
        return;
    }

    try {
      setLoading(true);
      setStudent(null);
      
      const { data } = await ReportAPI.get("/Mark/uploade");
      const found = data?.data?.find(
        (s) => String(s.rollNo) === rollNo.trim()
      );

      if (!found) {
        toast.error("Result not found. Verify Roll Number.");
        return;
      }

      setStudent(found);
    } catch (err) {
      toast.error("Database connection failure");
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = student
    ? student.subjects.reduce((a, b) => a + Number(b.marks || 0), 0)
    : 0;

  const resultStatus = student && student.subjects.every(s => Number(s.marks) >= 4) ? "PASS" : "FAIL";

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-white p-4 print:p-0">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
            <Loader />
        </div>
      )}

      <div className="w-full print:max-w-full">

        {/* SEARCH */}
        {!student && (
          <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 p-10 space-y-6 print:hidden">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-[900] text-slate-900 uppercase italic tracking-tighter">CT Examination Portal</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Transcript Retrieval System</p>
            </div>

            <div className="space-y-4 pt-4">
                <input
                  type="text"
                  placeholder="ENTER STUDENT ROLL NUMBER"
                  className="w-full bg-white border-none rounded-lg px-6 py-4 text-[11px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white transition-all shadow-inner"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />

                <button
                  onClick={handleSearch}
                  className="w-full bg-slate-900 text-white py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                >
                  Retrieve Transcript
                </button>
            </div>
          </div>
        )}

        {/* MARKSHEET */}
        {student && (
          <div className="animate-in zoom-in-95 duration-500">
            <div
              ref={printRef}
              className="marksheet relative bg-white border-2 border-slate-900 p-8 md:p-12 shadow-2xl rounded-sm print:shadow-none print:border-slate-300"
            >
              {/* HEADER */}
              <div className="flex items-center gap-8 border-b-2 border-slate-900 pb-10 relative z-10 print:border-slate-300">
                <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-2xl p-2 print:bg-black">ITM</div>

                <div className="text-center flex-1 space-y-1">
                  <h1 className="text-2xl md:text-3xl font-[900] uppercase text-slate-900 tracking-tighter italic">
                     Institute of Technology & Management
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    GIDA, Gorakhpur – 273209 • Uttar Pradesh
                  </p>
                  <div className="inline-block mt-4 px-6 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] print:bg-black">
                    Official CT Transcript
                  </div>
                </div>

                {/* QR SKELETON */}
                <div className="w-16 h-16 border border-slate-200 p-1 bg-white hidden md:block print:block">
                    <div className="w-full h-full bg-slate-900 opacity-10"></div>
                </div>
              </div>

              {/* INFO */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-[11px] font-bold uppercase mt-10 relative z-10 border-b border-slate-100 pb-10">
                <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 tracking-widest">Student Identity</p>
                    <p className="text-[14px] font-black text-slate-900 italic">{student.name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 tracking-widest">Enrollment Number</p>
                    <p className="text-[14px] font-black text-slate-900 italic">{student.rollNo}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 tracking-widest">Academic Department</p>
                    <p className="text-[14px] font-black text-slate-900 italic">{student.course}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] text-slate-400 tracking-widest">Semester Stage</p>
                    <p className="text-[14px] font-black text-slate-900 italic">{student.semester}</p>
                </div>
              </div>

              {/* TABLE */}
              <table className="w-full mt-10 text-[11px] font-bold border-collapse relative z-10">
                <thead className="bg-white">
                  <tr className="border-b-2 border-slate-900 print:border-slate-300">
                    <th className="px-6 py-4 text-left uppercase tracking-widest text-slate-400">Subject Code</th>
                    <th className="px-6 py-4 text-left uppercase tracking-widest text-slate-400 text-[10px]">Assessment Module</th>
                    <th className="px-6 py-4 text-center uppercase tracking-widest text-slate-400">Max</th>
                    <th className="px-6 py-4 text-center uppercase tracking-widest text-slate-400">Secured</th>
                    <th className="px-6 py-4 text-right uppercase tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 italic">
                  {student.subjects.map((s, i) => (
                    <tr key={i} className="group hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-500">CT-{String(i+1).padStart(3, '0')}</td>
                      <td className="px-6 py-4 font-black text-slate-900 uppercase">{s.subName || s.name}</td>
                      <td className="px-6 py-4 text-center font-black text-slate-400 italic">30.00</td>
                      <td className="px-6 py-4 text-center font-black text-indigo-600 text-[13px]">{Number(s.marks).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${Number(s.marks) >= 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {Number(s.marks) >= 4 ? "PASS" : "BACK"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-slate-900 relative z-10 print:border-slate-300">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aggregate Score</p>
                    <p className="text-4xl font-[900] text-slate-900 italic tracking-tighter">{totalMarks.toFixed(2)}</p>
                </div>
                
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Evaluation</p>
                    <span className={`px-10 py-3 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] italic ${resultStatus === "PASS" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                      {resultStatus}
                    </span>
                </div>
              </div>

              {/* AUTH */}
              <div className="mt-16 flex justify-between items-end relative z-10 opacity-[0.5] grayscale">
                <div className="flex gap-[3px]">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-slate-900"
                      style={{
                        width: i % 3 === 0 ? "2px" : "1px",
                        height: "40px",
                      }}
                    />
                  ))}
                </div>

                <div className="text-right space-y-1">
                  <div className="h-10 w-32 border-b border-slate-300 ml-auto mb-2 italic"></div>
                  <p className="text-[9px] font-black text-slate-900 uppercase italic">
                    Controller of Examination<br />
                    ITM Institutional Master Registry
                  </p>
                </div>
              </div>
            </div>

            {/* DOWNLOAD */}
            <div className="mt-8 flex justify-center gap-4 print:hidden">
              <button 
                onClick={() => setStudent(null)}
                className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
              >
                  Reset Search
              </button>
              <button
                onClick={handlePrint}
                className="bg-slate-900 text-white px-10 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all"
              >
                Download Master Transcript
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .marksheet::before {
          content: "ITM";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 250px;
          font-weight: 900;
          color: black;
          opacity: 0.02;
          z-index: 0;
        }

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background-color: white;
          }
          .marksheet {
            border: none;
            padding: 20mm;
          }
        }
      `}</style>
    </div>
  );
};

export default Resultschedule;




