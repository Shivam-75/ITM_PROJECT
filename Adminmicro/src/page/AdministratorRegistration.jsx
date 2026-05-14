import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiShield, FiPhone, FiMapPin, FiSave, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { authAPI } from "../api/apis";

const AdministratorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobNumber: "",
    password: "",
    superAdmin: "",
  });

  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, adminId: null, adminName: "" });

  // 🔹 Fetch Admin List & Current Profile
  const fetchAdmins = async () => {
    try {
      const { data } = await authAPI.get("/AdminList");
      if (data.adminList) {
        setAdmins(data.adminList);
      }
      
      // Fetch Current Admin to prevent self-delete
      const profileRes = await authAPI.get("/login");
      if (profileRes.data.data) {
        setCurrentAdminId(profileRes.data.data._id);
      }
    } catch (err) {
      console.error("Failed to fetch Admin data", err);
    }
  };

  // 🔹 Fetch Initial Data
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 🔹 Restrict Mobile Number to 10 Digits & Numeric Only
    if (name === "mobNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mobNumber.length !== 10) {
      return toast.warn("Mobile Number must be exactly 10 digits");
    }

    setLoading(true);
    try {
      const payload = {
          name: formData.name,
          mobNumber: Number(formData.mobNumber),
          password: formData.password,
          superAdmin: formData.superAdmin,
      };
      const res = await authAPI.post("/registration", payload);
      if (res.status === 201 || res.status === 200) {
          toast.success("Administrator Profile Created Successfully!", { theme: "colored", icon: "🚀" });
          setFormData({ name: "", mobNumber: "", password: "", superAdmin: false });
          fetchAdmins();
      }
    } catch (err) {
        toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { adminId } = deleteModal;
    setLoading(true);
    try {
      const res = await authAPI.delete(`/AdminList/Deleted/${adminId}`);
      if (res.status === 200) {
        toast.success("Administrator Deleted Successfully");
        fetchAdmins();
        setDeleteModal({ isOpen: false, adminId: null, adminName: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-700 pb-20 relative">
      {/* Custom Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 rounded-[10px]">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic leading-tight">Confirm Deletion</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-4">
                Are you sure you want to remove <span className="text-red-600">{deleteModal.adminName}</span> from the authority registry?
              </p>
            </div>
            <div className="flex border-t border-slate-50">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, adminId: null, adminName: "" })}
                className="flex-1 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-red-600 text-[10px] font-black text-white uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Registration Form */}
        <div className="xl:col-span-2">
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
                      type="text" name="mobNumber" required
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
                      value={formData.superAdmin} onChange={(e) => setFormData({...formData, superAdmin: e.target.value === 'true' ? true : e.target.value === 'false' ? false : ""})}
                    >
                      <option value="">Select Option</option>
                      <option value="false">False</option>
                      <option value="true">True</option>
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
                className="px-12 py-5 bg-slate-900 text-white rounded-lg text-[13px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-red-600 transition-all active:scale-95 flex items-center gap-4 italic group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Registry...
                  </>
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

        {/* Registered Admins List */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
                 <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
                 Personnel Registry
               </h3>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{admins.length} Logged</span>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
              {admins.length === 0 ? (
                <div className="p-10 text-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">
                  No active personnel logged
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {admins.map((admin) => (
                    <div key={admin._id} className="p-6 hover:bg-red-50/30 transition-colors group relative">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                            <FiUser size={18} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight leading-none">
                              {admin.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                               <span className={`text-[8px] font-bold uppercase tracking-tighter ${admin.superAdmin ? 'text-amber-600' : 'text-slate-400'}`}>
                                 {admin.superAdmin ? 'Super Authority' : 'Standard Access'}
                               </span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                              <FiPhone size={10} /> {admin.mobNumber}
                            </p>
                          </div>
                          
                          {currentAdminId !== admin._id && (
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, adminId: admin._id, adminName: admin.name })}
                              className="md:opacity-0 md:group-hover:opacity-100 opacity-100 p-2 text-slate-300 hover:text-red-600 transition-all"
                              title="Delete Admin"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorRegistration;
