import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../store/AdminStore";
import { authAPI } from "../api/apis";
import { FiPhone, FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";

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
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-red-100">
      <div className="max-w-[750px] w-full grid grid-cols-1 lg:grid-cols-2 rounded-[24px] overflow-hidden shadow-2xl bg-white min-h-[450px]">
        
        {/* Left Side - Info Panel */}
        <div className="bg-[#334e68] p-8 md:p-10 flex flex-col justify-center text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative z-10 space-y-6">
             <div className="w-12 h-1 bg-white/20 rounded-full"></div>
             <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
               Welcome back to <br />
               <span className="text-blue-200 italic">ITM College.</span>
             </h1>
             <p className="text-lg text-blue-100/70 font-medium leading-relaxed max-w-sm">
               Administrative Control Panel. Manage core institutional nodes and metadata.
             </p>
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 italic">
                <FiCheckCircle className="text-emerald-400" />
                ADMIN SECURE CHANNEL
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-10 bg-[#fcfcfd] flex flex-col justify-center relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="max-w-sm w-full mx-auto space-y-8">
            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Admin Login</h2>
                   <p className="text-slate-400 text-sm font-medium">Verify administrative credentials.</p>
                </div>

                <form onSubmit={handleVerifyContact} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identifier</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-red-500 transition-colors">
                        <FiPhone size={18} />
                      </div>
                      <input
                        type="text"
                        name="mobNumber"
                        placeholder="Mobile Number"
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-slate-700 font-bold tracking-widest"
                        value={formData.mobNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#cc3333] hover:bg-[#b32d2d] text-white text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 active:scale-95"
                  >
                    VERIFY <FiArrowRight />
                  </button>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button 
                  onClick={() => setStep(1)}
                  className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline mb-6 flex items-center gap-2"
                >
                   ← Change Number
                </button>

                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Authentication</h2>
                   <p className="text-slate-400 text-sm font-medium">Verified: <span className="text-slate-900 font-bold">{userState.name}</span></p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-red-500 transition-colors">
                        <FiLock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all text-slate-700 font-bold tracking-widest"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-red-500 transition-colors"
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#cc3333] hover:bg-[#b32d2d] text-white text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 active:scale-95"
                  >
                    EXECUTE LOGIN <FiArrowRight />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logins;




