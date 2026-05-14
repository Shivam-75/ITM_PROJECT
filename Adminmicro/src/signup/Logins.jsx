import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../store/AdminStore";
import { authAPI } from "../api/apis";
import { FiPhone, FiLock, FiChevronRight, FiArrowLeft, FiUser, FiShield, FiEye, FiEyeOff } from "react-icons/fi";

const Logins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Contact, 2: Auth
  const [userState, setUserState] = useState({
    exists: false,
    name: ""
  });
  const { toststyle, UserLogsData } = useAuth();

  const [formData, setFormData] = useState({
    mobNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyContact = async (e) => {
    e.preventDefault();
    if (!formData.mobNumber) {
      toast.error("Please enter mobile number", toststyle);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.post("/verify-contact", { mobNumber: formData.mobNumber });
      setUserState({
        exists: data.exists,
        name: data.name
      });
      setStep(2);
      toast.success(`Verified: ${data.name}`, toststyle);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed", toststyle);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      toast.error("Please enter password", toststyle);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.post(
        "/login",
        formData,
        { withCredentials: true }
      );
      UserLogsData();
      toast.success(data?.message || "Welcome back, Admin!", toststyle);
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Authentication failed",
        toststyle
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-slate-500/30 relative overflow-hidden">
      {/* Hyper-Premium Background - Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-slate-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-50"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-50" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-[850px] w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] rounded-[40px] overflow-hidden shadow-[0_0_1px_1px_rgba(255,255,255,0.05),0_32px_64px_-16px_rgba(0,0,0,0.7)] bg-slate-900/40 backdrop-blur-3xl border border-white/5 min-h-[500px] relative z-10 transition-all duration-700">
        
        {/* Left Side - Identity & Brand */}
        <div className="p-10 md:p-14 flex flex-col justify-between text-white relative overflow-hidden group">
          {/* Internal Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-600/10 via-transparent to-blue-600/10 opacity-40"></div>
          
          <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Admin Command v4.0</span>
             </div>

             <div className="space-y-4">
               <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter">
                 Institutional <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-blue-200 italic">Control Center.</span>
               </h1>
               <p className="text-base text-slate-400 font-medium leading-relaxed max-w-sm">
                 Welcome to the <span className="text-white font-bold">ITM Admin Cloud</span>. Manage core institutional nodes, metadata, and user permissions securely.
               </p>
             </div>

             <div className="pt-8 flex items-center gap-6">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        ADM
                     </div>
                   ))}
                </div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Authorized Access Only</p>
             </div>
          </div>

          <div className="relative z-10 pt-10">
             <div className="flex items-center gap-4 text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">
                <FiLock className="text-slate-400" />
                Root Terminal Secured
             </div>
          </div>
        </div>

        {/* Right Side - Interactive Portal */}
        <div className="bg-white p-10 md:p-14 flex flex-col justify-center relative">
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-500">
              <div className="w-12 h-12 border-[3px] border-slate-100 rounded-full relative overflow-hidden">
                 <div className="absolute inset-0 border-t-[3px] border-slate-900 animate-spin rounded-full"></div>
              </div>
            </div>
          )}

          <div className="max-w-sm w-full mx-auto space-y-10">
            {step === 1 ? (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="space-y-3 text-center lg:text-left">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Access</h2>
                   <p className="text-slate-400 text-sm font-medium tracking-tight">Identify root credentials to proceed.</p>
                </div>

                <form onSubmit={handleVerifyContact} className="mt-12 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                       <FiUser className="text-slate-900" /> Identifier
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="mobNumber"
                        placeholder="Mobile Number"
                        className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all duration-500 text-slate-900 text-2xl font-black tracking-[0.1em] placeholder:text-slate-300"
                        value={formData.mobNumber}
                        onChange={handleChange}
                        required
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-700 group-focus-within:w-full"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full group relative py-5 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all duration-500 overflow-hidden shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em]">
                      Verify Identity <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all mb-8"
                >
                   <FiArrowLeft /> Return to Identity
                </button>

                <div className="space-y-3">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Clearance</h2>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-slate-900 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{userState.name}</span>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                         <FiShield className="text-slate-900" /> Access Key
                      </label>
                      <div className="relative group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all duration-500 text-slate-900 text-2xl font-black tracking-[0.2em] placeholder:text-slate-300"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          autoFocus
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-700 group-focus-within:w-full"></div>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full group relative py-5 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all duration-500 overflow-hidden shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em]">
                      Authorize Access <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Brand Text */}
      <div className="absolute bottom-10 left-10 text-[120px] font-black text-white/[0.02] leading-none select-none pointer-events-none uppercase italic">
        Admin
      </div>
    </div>
  );
};

export default Logins;
