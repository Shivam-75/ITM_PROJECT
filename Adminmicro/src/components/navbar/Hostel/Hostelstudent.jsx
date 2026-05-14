import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

const Hostelstudent = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const [studentRes, allocRes, payRes] = await Promise.all([
          axios.get("https://itm-project-6vtr.onrender.com/api/v1/Admin/StudentList", { withCredentials: true }),
          axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/allocate", { withCredentials: true }),
          axios.get("https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Payment/history", { withCredentials: true })
        ]);

        const allStudents = studentRes.data.studentList || [];
        const hostelRegistered = allStudents.filter(s => s.isHostel === true);
        const allocations = allocRes.data.allocations || [];
        const payments = payRes.data.payments || [];

        // Enrich student profiles with allocation and payment data
        const enriched = hostelRegistered.map(profile => {
          const allocation = allocations.find(a => a.studentId === profile.studentId);
          const studentPayments = payments.filter(p => 
            p.studentId === profile.studentId && p.paymentType === "Hostel"
          );
          const totalPaid = studentPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
          const totalFee = Number(profile.hostelFee || 0);

          return {
            _id: profile._id,
            studentName: profile.name || profile.studentName,
            studentId: profile.studentId,
            course: profile.course,
            roomNo: allocation?.roomNo || "NOT ASSIGNED",
            joiningDate: allocation?.joiningDate,
            totalHostelFee: totalFee,
            paidHostelFee: totalPaid,
            pendingFee: Math.max(0, totalFee - totalPaid),
            status: allocation ? "Active" : "Pending Assignment"
          };
        });

        setStudentsData(enriched);
      } catch (err) { 
        console.error(err);
        toast.error("Failed to synchronize hostel student registry"); 
      }
      finally { setLoading(false); }
    };
    fetchStudents();
  }, []);
 
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this student from hostel? This will free up the room capacity.")) return;
    try {
      await axios.delete(`https://itm-project-1-ilmh.onrender.com/api/v3/Admin/Hostel/allocate/${id}`, { withCredentials: true });
      toast.success("Student removed from hostel");
      setStudentsData(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  // 🔎 Filter Logic
  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      return (
        (student.studentId?.toLowerCase().includes(search.toLowerCase()) || 
         student.studentName?.toLowerCase().includes(search.toLowerCase())) &&
        (courseFilter ? student.course === courseFilter : true)
      );
    });
  }, [search, courseFilter, studentsData]);

  const total = studentsData.length;
  const active = studentsData.filter(s => s.status === "Active").length;
  const vacated = studentsData.filter(s => s.status === "Left").length;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hostel Students</h1>
        <p className="text-gray-500">Manage all hostel allocated students</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Total Students</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>
        <div className="bg-green-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Active Students</p>
          <h2 className="text-2xl font-bold">{active}</h2>
        </div>
        <div className="bg-red-500 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Vacated/Left</p>
          <h2 className="text-2xl font-bold">{vacated}</h2>
        </div>
      </div>



      {/* Students Table */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Name</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Student ID</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Placement</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total Fee</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Paid Amt</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Pending</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">Status</th>
              <th className="p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="text-center p-5">Loading...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="6" className="p-5 text-center text-gray-500">No students found</td></tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={index} className="border-b hover:bg-white">
                  <td className="p-3">
                    <p className="text-[11px] font-black text-slate-900 uppercase italic leading-none">{student.studentName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.course}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-white border border-slate-100 border border-slate-100 rounded text-[9px] font-black text-slate-600 italic">{student.studentId}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black italic uppercase ${student.roomNo === "NOT ASSIGNED" ? "text-amber-500" : "text-blue-600"}`}>
                        {student.roomNo === "NOT ASSIGNED" ? "No Room" : `Room ${student.roomNo}`}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">
                        {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : "Pending Join"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-black text-slate-900 text-[11px] italic">₹{student.totalHostelFee?.toLocaleString() || 0}</td>
                  <td className="p-3">
                    <span className={`text-[11px] font-black italic ${student.paidHostelFee >= student.totalHostelFee ? "text-emerald-500" : "text-amber-500"}`}>
                      ₹{student.paidHostelFee?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-black italic ${student.pendingFee > 0 ? "text-rose-500" : "text-slate-300"}`}>
                      {student.pendingFee > 0 ? `₹${student.pendingFee.toLocaleString()}` : "Dues Clear"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${
                      student.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hostelstudent;




