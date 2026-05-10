import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiShield, FiPhone, FiMapPin, FiSave, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const AdministratorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobNumber: "",
    password: "",
    superAdmin: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const payload = {
          name: formData.name,
          mobNumber: Number(formData.mobNumber),
          password: formData.password,
          superAdmin: formData.superAdmin
      };
      const res = await axios.post("http://localhost:5000/api/v1/Admin/registration", payload, { withCredentials: true });
      if (res.status === 201 || res.status === 200) {
          toast.success("Administrator Profile Created Successfully!", { theme: "colored", icon: "🚀" });
          setFormData({ name: "", mobNumber: "", password: "", superAdmin: false });
      }
    } catch (err) {
        toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
        setLoading(false);
    }
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
          <div className="bg-white p-8 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <FiShield size={120} className="text-red-600" />
            </div>
            
            <h3 className="text-[11px] font-black text-red-600 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
              <span className="w-6 h-[2px] bg-red-600"></span>
              Identity Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Canonical Name (name)</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text" name="name" required
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="Enter unique admin name"
                    value={formData.name} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact (mobNumber)</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="number" name="mobNumber" required
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="91XXXXXXXX"
                    value={formData.mobNumber} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Super Admin Privileges</label>
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <select
                    name="superAdmin" required
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.superAdmin} onChange={(e) => setFormData({...formData, superAdmin: e.target.value === 'true'})}
                  >
                    <option value="false">Standard Admin</option>
                    <option value="true">Super Administrator</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password" name="password" required
                    className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none transition-all"
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit" disabled={loading}
              className="px-12 py-5 bg-slate-900 text-white rounded-lg text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center gap-4 italic group"
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




