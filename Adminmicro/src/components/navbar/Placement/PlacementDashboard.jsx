import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FiPlus, 
  FiBriefcase, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiExternalLink, 
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiUser
} from "react-icons/fi";
import useAuth from "../../../store/AdminStore";
import Loader from "../../Loader";

const PlacementDashboard = () => {
  const { toststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("drives"); // "drives" or "applications"
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Registry States
  const [courses, setCourses] = useState([]);
  const [semestersList, setSemestersList] = useState([]);
  
  const [formData, setFormData] = useState({
    companyName: "",
    jobProfile: "",
    ctc: "",
    eligibility: "",
    course: "",
    semester: "",
    deadline: "",
    description: "",
    teacherId: "ADMIN_DRIVE", // Default
    status: "Active"
  });

  const fetchRegistries = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        axios.get("http://localhost:5002/api/v3/Admin/Academic/courses", { withCredentials: true }),
        axios.get("http://localhost:5002/api/v3/Admin/Academic/semesters", { withCredentials: true })
      ]);
      if (cRes.data.data) setCourses(cRes.data.data);
      if (sRes.data.data) setSemestersList(sRes.data.data);
    } catch (err) {
      console.error("Registry Sync Failed", err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/v3/Admin/Placement/drives", { withCredentials: true });
      if (res.data.data) setDrives(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async (driveId) => {
    try {
      setLoading(true);
      const url = driveId 
        ? `http://localhost:5002/api/v3/Admin/Placement/applications?placementId=${driveId}`
        : "http://localhost:5002/api/v3/Admin/Placement/applications";
      const res = await axios.get(url, { withCredentials: true });
      if (res.data.data) setApplications(res.data.data);
      setView("applications");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistries();
    fetchData();
  }, [fetchRegistries, fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5002/api/v3/Admin/Placement/drives", formData, { withCredentials: true });
      toast.success("Placement Drive Created", toststyle);
      setShowModal(false);
      setFormData({
        companyName: "", jobProfile: "", ctc: "", eligibility: "",
        course: "", semester: "", deadline: "", description: "",
        teacherId: "ADMIN_DRIVE", status: "Active"
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:5002/api/v3/Admin/Placement/applications/${appId}`, { status }, { withCredentials: true });
      toast.success(`Status updated to ${status}`, toststyle);
      fetchApplications(selectedDrive?._id);
    } catch (err) {
      toast.error("Status Update Failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {loading && <Loader />}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-lg text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-20 -mt-20 blur-[100px] opacity-20"></div>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-lg italic backdrop-blur-md border border-white/5">Corporate Relations</span>
             <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                <FiCheckCircle size={10} /> Placement Engine Active
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
            Placement <span className="text-indigo-400">Drives</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-xl">
            Managing institutional recruitment windows and student applications.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => { setView("drives"); setSelectedDrive(null); }}
            className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all border ${view === 'drives' ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
          >
            All Drives
          </button>
          <button 
            onClick={() => fetchApplications()}
            className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all border ${view === 'applications' ? 'bg-white text-slate-900 border-white shadow-xl' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
          >
            Applications
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-black uppercase tracking-widest text-[10px] italic hover:bg-white border border-slate-1000 transition-all shadow-xl shadow-indigo-600/20"
          >
            <FiPlus /> New Drive
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        {view === "drives" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Company</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Profile</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Package (CTC)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">Applications</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Deadline</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {drives.length === 0 ? (
                  <tr><td colSpan="6" className="py-32 text-center text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No recruitment windows defined</td></tr>
                ) : (
                  drives.map((drive) => (
                    <tr key={drive._id} className="group hover:bg-white/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <FiBriefcase size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{drive.companyName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{drive.course} • {drive.semester}th Sem</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-600 italic uppercase">{drive.jobProfile}</td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black italic">{drive.ctc} LPA</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <button 
                           onClick={() => { setSelectedDrive(drive); fetchApplications(drive._id); }}
                           className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest italic"
                         >
                            View Submissions
                         </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <p className="text-[10px] font-black text-rose-500 uppercase italic tracking-tight">{new Date(drive.deadline).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity">
                           <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><FiExternalLink size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Applications View */
          <div className="p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">
                   {selectedDrive ? `${selectedDrive.companyName} - Submissions` : "All Applications"}
                </h2>
                <button 
                  onClick={() => { setView("drives"); setSelectedDrive(null); }}
                  className="px-4 py-2 bg-white text-[10px] font-black uppercase tracking-widest italic text-slate-500 rounded-lg hover:bg-slate-200"
                >
                   Back to Drives
                </button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Student</th>
                      <th className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Academic</th>
                      <th className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Contact</th>
                      <th className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 italic text-center">Status</th>
                      <th className="py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 italic text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {applications.length === 0 ? (
                      <tr><td colSpan="5" className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No applications received yet</td></tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app._id} className="hover:bg-white/50 transition-colors">
                          <td className="py-6 flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 font-black italic text-xs">{app.studentName[0]}</div>
                             <div>
                                <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{app.studentName}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {app.studentId}</p>
                             </div>
                          </td>
                          <td className="py-6">
                             <p className="text-[10px] font-bold text-slate-600 uppercase italic">{app.course} • SEM {app.semester}</p>
                          </td>
                          <td className="py-6">
                             <p className="text-[10px] font-bold text-slate-600 italic tracking-widest">{app.studentMobile}</p>
                          </td>
                          <td className="py-6 text-center">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] italic ${
                               app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                               app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                               'bg-white border border-slate-100 text-indigo-600'
                             }`}>
                                {app.status}
                             </span>
                          </td>
                          <td className="py-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button onClick={() => updateStatus(app._id, "Selected")} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"><FiCheckCircle /></button>
                                <button onClick={() => updateStatus(app._id, "Rejected")} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><FiXCircle /></button>
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* Drive Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/50">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Initialize Recruitment</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Placement Registry Protocol</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-3 bg-white text-slate-400 hover:text-rose-500 rounded-lg shadow-sm hover:shadow-md transition-all">
                    <FiXCircle size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiBriefcase /> Company Name</label>
                       <input 
                         required type="text" placeholder="e.g. Google India" 
                         value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiUser /> Job Profile</label>
                       <input 
                         required type="text" placeholder="e.g. Software Engineer" 
                         value={formData.jobProfile} onChange={(e) => setFormData({...formData, jobProfile: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiDollarSign /> Package (CTC in LPA)</label>
                       <input 
                         required type="text" placeholder="e.g. 12.5" 
                         value={formData.ctc} onChange={(e) => setFormData({...formData, ctc: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiCalendar /> Application Deadline</label>
                       <input 
                         required type="date" 
                         value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiFilter /> Target Course</label>
                       <select 
                         required 
                         value={formData.course} 
                         onChange={(e) => setFormData({...formData, course: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                       >
                         <option value="">Select Target Course</option>
                         {courses.map(c => <option key={c._id} value={c.name}>{c.name.toUpperCase()}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2"><FiClock /> Target Semester</label>
                       <select 
                         required 
                         value={formData.semester} 
                         onChange={(e) => setFormData({...formData, semester: e.target.value})}
                         className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                       >
                         <option value="">Select Target Semester</option>
                         {semestersList.map(s => <option key={s._id} value={s.name}>{s.name.toUpperCase()}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Eligibility Criteria</label>
                    <textarea 
                      required placeholder="e.g. 7.5 CGPA, No Active Backlogs" 
                      value={formData.eligibility} onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
                      className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner h-24 resize-none" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Job Description</label>
                    <textarea 
                      required placeholder="Provide detailed roles and responsibilities..." 
                      value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-4 bg-white border border-slate-100 rounded-lg text-xs font-black italic tracking-tight outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner h-32 resize-none" 
                    />
                 </div>

                 <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-lg text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
                    Broadcast Recruitment Window
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PlacementDashboard;



