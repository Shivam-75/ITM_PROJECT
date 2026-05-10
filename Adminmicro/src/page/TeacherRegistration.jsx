import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiBookOpen, FiClock, FiPhone, FiLock, FiUserPlus, FiLayers, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { TeacherAuthAPI, ReportAPI } from "../api/apis";

const TeacherRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    year: "",
    course: "",
    moNumber: "",
    gender: "",
    role: "faculty",
  });

  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Academic Registries
  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const [cRes, yRes] = await Promise.all([
          ReportAPI.get("/Academic/file-courses"),
          ReportAPI.get("/Academic/file-years")
        ]);
        if (cRes.data.courses) setCourses(cRes.data.courses);
        if (yRes.data.years) setYears(yRes.data.years);
      } catch (err) {
        console.error("Registry sync error:", err);
      }
    };
    fetchRegistries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Schema adherence for moNumber
    if (name === "moNumber") {
      if (value !== "" && !/^[0-9]+$/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Align payload exactly with TeacherSchema in auth
      const payload = {
        ...formData,
        moNumber: Number(formData.moNumber),
        isFaculty: true, // Default as per schema context for this page
      };

      const response = await TeacherAuthAPI.post("/registration", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Teacher Registry Synchronized Successfully", {
          theme: "colored",
          icon: "🛡️"
        });
        setFormData({
          name: "",
          password: "",
          year: "",
          course: "",
          moNumber: "",
          gender: "",
          role: "faculty",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Failure: User Not Registered");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-700 pb-20">
      {/* Header aligned with Administration Module */}
      <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
        <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Faculty Enrollment
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
             Auth Schema Sync Protocol <span className="mx-2 text-indigo-200">|</span> d:\ITMbackend\Auth\src\models\teacherModels.model.js
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Core Identity (Schema: name, moNumber, gender, role) */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-10 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-indigo-600"></span>
              Identity Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Full Name (name)</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <input
                    type="text" name="name" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic uppercase"
                    placeholder="ENTER FULL NAME"
                    value={formData.name} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Mobile Number (moNumber)</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <input
                    type="tel" name="moNumber" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic"
                    placeholder="10 DIGIT NUMBER"
                    value={formData.moNumber} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Access Key (password)</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <input
                    type="password" name="password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic"
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Gender Specification (gender)</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    name="gender" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic appearance-none cursor-pointer"
                    value={formData.gender} onChange={handleChange}
                  >
                    <option value="">Choose Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Auth Role (role)</label>
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    name="role" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic appearance-none cursor-pointer"
                    value={formData.role} onChange={handleChange}
                  >
                    <option value="faculty">Faculty Member</option>
                    <option value="admin">Administrator (Academic)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Academic Metadata (Schema: year, course) */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-10 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-indigo-600"></span>
              Placement Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Authorized Course (course)</label>
                <div className="relative">
                  <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    name="course" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic appearance-none cursor-pointer"
                    value={formData.course} onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    {courses.map(course => (
                      <option key={course.id || course.name} value={course.name.toLowerCase()}>
                        {course.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-sans">Active Session (year)</label>
                <div className="relative">
                  <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <select
                    name="year" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-600 outline-none transition-all italic appearance-none cursor-pointer"
                    value={formData.year} onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    {years.map(year => (
                      <option key={year.id || year.name} value={year.name}>
                        {year.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit" disabled={loading}
              className="px-16 py-5 bg-slate-900 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-4 italic group disabled:bg-slate-400"
            >
              {loading ? (
                "Processing Cryptography..."
              ) : (
                <>
                  <FiUserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                  Authorize Enrollment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistration;
