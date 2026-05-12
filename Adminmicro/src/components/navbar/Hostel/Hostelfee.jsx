import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUpload, FiX, FiFileText, FiTrash2 } from "react-icons/fi";

const Hostelfee = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // New States for Upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", fileUrl: "" });

  const fetchData = async () => {
      try {
          setLoading(true);
          const [allocRes, structRes, docRes] = await Promise.all([
              axios.get("http://localhost:5002/api/v3/Admin/Hostel/allocate", { withCredentials: true }),
              axios.get("http://localhost:5002/api/v3/Admin/Fee/structure", { withCredentials: true }),
              axios.get("http://localhost:5002/api/v3/Admin/Upload/all", { withCredentials: true })
          ]);
          
          const allocations = allocRes.data.allocations || [];
          const structures = structRes.data.structures || [];
          
          const combined = allocations.map(a => {
              const struct = structures.find(s => s.courseName?.toLowerCase() === a.course?.toLowerCase()) || { hostelFee: 65000 };
              return {
                  ...a,
                  totalHostelFee: struct.hostelFee || 65000,
                  paid: 0, // In real world, fetch payments
                  status: "Pending"
              };
          });
          setData(combined);

          if (docRes.data.success) {
            setDocuments(docRes.data.data.filter(d => d.category === "hostel-fee"));
          }
      } catch (err) {
          toast.error("Failed to fetch hostel fee data");
      } finally {
          setLoading(false);
      }
  };
  
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/v3/Admin/Upload/all", { withCredentials: true });
      if (response.data.success) {
        setDocuments(response.data.data.filter(d => d.category === "hostel-fee"));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔎 Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((student) => {
      return (
        (student.studentId?.toLowerCase().includes(search.toLowerCase()) || 
         student.studentName?.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter ? student.status === statusFilter : true)
      );
    });
  }, [search, statusFilter, data]);

  // 📊 Summary Calculations
  const totalStudents = data.length;
  const totalRevenue = data.reduce((sum, s) => sum + s.totalHostelFee, 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hostel Fee Management</h1>
          <p className="text-gray-500">Manage hostel fee records for all allocated students</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-[#0f172a] text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic shadow-lg flex items-center gap-3 hover:scale-105 transition-all"
        >
          <FiUpload size={16} />
          Publish Hostel Fee Document
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Allocated Students</p>
          <h2 className="text-2xl font-bold">{totalStudents}</h2>
        </div>
        <div className="bg-green-600 text-white rounded-lg p-5 shadow">
          <p className="text-sm">Total Projected Revenue</p>
          <h2 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by Name or ID..."
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-3 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Room</th>
              <th className="p-3">Fee Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="5" className="p-5 text-center text-gray-500">No records found</td></tr>
            ) : (
              filteredData.map((student, index) => (
                <tr key={index} className="border-b hover:bg-white">
                  <td className="p-3 font-medium">
                    {student.studentName}
                    <p className="text-xs text-gray-500">{student.studentId}</p>
                  </td>
                  <td className="p-3 capitalize">{student.course}</td>
                  <td className="p-3">Room {student.roomNo}</td>
                  <td className="p-3 font-semibold">₹{student.totalHostelFee.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* 🚀 Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Hostel Publication</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fee Structure & Room Rates Registry</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Form Side */}
              <div className="p-8 space-y-6 border-r border-slate-100">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Document Heading</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Hostel Fee Details 2024-25"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Source URL (Drive/S3)</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      value={uploadForm.fileUrl}
                      onChange={(e) => setUploadForm({...uploadForm, fileUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Internal Brief</label>
                    <textarea 
                      placeholder="Optional details..."
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all h-24 resize-none"
                    ></textarea>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await axios.post("http://localhost:5002/api/v3/Admin/Upload/create", {
                        ...uploadForm,
                        category: "hostel-fee",
                        uploadedBy: "Admin"
                      }, { withCredentials: true });
                      setUploadForm({ title: "", description: "", fileUrl: "" });
                      fetchDocuments();
                      toast.success("Document Published");
                    } catch (err) { toast.error("Upload failed"); } finally { setLoading(false); }
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-black uppercase tracking-widest text-xs italic shadow-xl shadow-blue-200"
                >
                  Confirm Publication
                </button>
              </div>

              {/* List Side */}
              <div className="p-8 bg-gray-50/30 overflow-y-auto max-h-[500px] custom-scrollbar">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 italic">Active Publication Log</h3>
                <div className="space-y-4">
                  {documents.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] italic">No active documents found</p>
                  ) : (
                    documents.map((doc) => (
                      <div key={doc._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FiFileText size={20} />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-gray-900 uppercase italic leading-none">{doc.title}</p>
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-blue-500 uppercase tracking-widest hover:underline mt-1 block">View Resource</a>
                          </div>
                        </div>
                        <button 
                          onClick={async () => {
                            try {
                              setLoading(true);
                              await axios.delete(`http://localhost:5002/api/v3/Admin/Upload/${doc._id}`, { withCredentials: true });
                              fetchDocuments();
                              toast.success("Document Purged");
                            } catch (err) { toast.error("Delete failed"); } finally { setLoading(false); }
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hostelfee;




