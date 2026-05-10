import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiShield, FiPhone, FiMapPin, FiSave, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const AdministratorRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Admin",
    department: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Administrator Profile Created Successfully!", {
        theme: "colored",
        icon: "🚀"
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-10 bg-red-600 rounded-full shadow-lg shadow-red-600/20"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Administrator Registration
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
            Core Authority Enrollment Protocol
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Profile Identity */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <FiShield size={120} className="text-red-600" />
            </div>
            
            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-red-600"></span>
              Identity Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Canonical Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text" name="fullName" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="Enter full legal name"
                    value={formData.fullName} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email Node</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="email" name="email" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="admin@itm.edu"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Link</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="tel" name="phone" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="+91 00000 00000"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Department</label>
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <select
                    name="department" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.department} onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Executive">Executive Office</option>
                    <option value="Academic">Academic Affairs</option>
                    <option value="Admission">Admission Control</option>
                    <option value="Finance">Financial Audit</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Security Matrix */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-red-600"></span>
              Security Authentication
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Establish Security Key</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password" name="password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Security Key</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password" name="confirmPassword" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Residence Metadata */}
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-red-600"></span>
              Locational Metadata
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registered Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-5 text-slate-300" />
                <textarea
                  name="address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all h-32 resize-none"
                  placeholder="Enter full residential details"
                  value={formData.address} onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit" disabled={loading}
              className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center gap-4 italic group"
            >
              {loading ? (
                "Processing Registry..."
              ) : (
                <>
                  <FiUserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                  Finalize Enrollment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdministratorRegistration;
