import { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { authAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { FiEye, FiEyeOff, FiLock, FiSmartphone, FiShield, FiCpu, FiActivity } from "react-icons/fi";

const Login = () => {
  const { setloginregistration, UserLogsData, toaststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    moNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.moNumber || !formData.password) {
      toast.error("Contact aur Password dono bharna zaroori hai", toaststyle);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.post("/login", formData, { withCredentials: true });
      toast.success(data?.message || "Login Success", toaststyle);
      UserLogsData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed", toaststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-mono flex flex-col selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden relative">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
             backgroundSize: "40px 40px"
           }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-950/10 via-transparent to-transparent z-0 pointer-events-none"></div>

      {/* TOP SYSTEM BAR */}
      <div className="h-10 border-b border-white/5 flex items-center px-6 justify-between relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center space-x-6 text-[10px] font-bold tracking-widest text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">[</span>
            <span className="text-slate-300">CORE_MODULE_READY</span>
            <span className="text-red-500">]</span>
          </div>
          <div className="flex items-center space-x-2">
             <FiActivity className="text-blue-500" />
             <span>UPLINK: ACTIVE</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-full animate-pulse"></div>
           </div>
           <span className="text-[10px] font-black text-blue-500">INIT: 100%</span>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 bg-black/60 border border-white/5 rounded-lg overflow-hidden shadow-[0_0_80px_-20px_rgba(37,99,235,0.15)] backdrop-blur-2xl">
          
          {/* LEFT: SYSTEM STATS / INFO */}
          <div className="hidden lg:flex lg:col-span-5 p-12 flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors duration-700"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="inline-flex p-4 rounded-lg bg-white/5 border border-white/10 shadow-inner">
                <FiCpu className="text-blue-500" size={32} />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter text-white leading-tight">
                  ITM <br/>
                  <span className="text-blue-600">CENTRAL</span>
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Authentication gateway for Student Academic Portal. Access grades, attendance, and course material via secure handshake.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latency</div>
                   <div className="text-xl font-black text-blue-400">14ms</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol</div>
                   <div className="text-xl font-black text-slate-200 italic">V2.0</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                     <FiShield className="text-blue-500" size={18} />
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 leading-tight">
                     END-TO-END <br/> ENCRYPTED SESSION
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: LOGIN FORM */}
          <div className="lg:col-span-7 bg-white/[0.02] p-8 sm:p-16 xl:p-20 border-l border-white/5">
            <div className="max-w-md w-full mx-auto">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 rounded-r-3xl">
                  <Loader />
                </div>
              )}

              <div className="mb-12 space-y-3">
                <div className="inline-block px-3 py-1 bg-blue-600/10 text-blue-500 rounded-lg text-[10px] font-black tracking-[0.2em] uppercase border border-blue-600/20">
                  Uplink Required
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">Initialize Login</h2>
                <p className="text-slate-500 text-sm font-medium">Identify yourself within the ITM ecosystem.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Terminal ID (Mobile)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <FiSmartphone size={18} />
                    </div>
                    <input
                      type="tel"
                      name="moNumber"
                      placeholder="0000000000"
                      className="w-full pl-12 pr-6 py-5 bg-white/5 border border-white/10 rounded-lg focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white/10 outline-none transition-all text-white font-bold tracking-widest placeholder:text-slate-700"
                      value={formData.moNumber}
                      onChange={handleChange}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-14 py-5 bg-white/5 border border-white/10 rounded-lg focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white/10 outline-none transition-all text-white font-bold tracking-widest placeholder:text-slate-700"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-600 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setloginregistration(true)}>
                      <div className="w-2 h-2 rounded-full border border-blue-600 group-hover:bg-blue-600 transition-colors"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">New Deployment?</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Recovery Link</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 rounded-lg shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "ESTABLISHING LINK..." : "EXECUTE SIGN_IN →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER STATS */}
      <div className="h-10 border-t border-white/5 bg-black/40 flex items-center px-6 text-[9px] font-bold text-slate-600 tracking-widest relative z-10">
         <div className="flex-1">ST_SESSION_KEY: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
         <div className="flex items-center space-x-6">
            <span>REGION: ASIA_PACIFIC</span>
            <span className="text-blue-600">ST_PORTAL_V2.0.4</span>
         </div>
      </div>
    </div>
  );
};

export default Login;



