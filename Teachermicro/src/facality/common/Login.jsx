import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../store/FacultyStore";
import BigLoader from "./BigLoader";
import { toast } from "react-toastify";
import { authAPI } from "../api/apis";
import { FiEye, FiEyeOff, FiZap, FiCpu, FiShield, FiSmartphone, FiLock, FiArrowRight } from "react-icons/fi";

function Login() {
  const { toststyle, UserLogsData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    moNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.moNumber || !loginData.password) {
      toast.error("Fill Contact Number And password !!", toststyle);
      return;
    }

    try {
      setLoading(true);

      const { data } = await authAPI.post(
        "/login",
        loginData,
        { withCredentials: true }
      );

      toast.success(data?.message || "Login Success", toststyle);
      UserLogsData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed",
        toststyle
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-mono flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden relative">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
           style={{
             backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
             backgroundSize: "40px 40px"
           }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent z-0 pointer-events-none"></div>

      {/* TOP SYSTEM BAR */}
      <div className="h-10 border-b border-white/5 flex items-center px-6 justify-between relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center space-x-6 text-[10px] font-bold tracking-widest text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="text-indigo-500">[</span>
            <span className="text-slate-300">FACULTY_NODE_READY</span>
            <span className="text-indigo-500">]</span>
          </div>
          <div className="flex items-center space-x-2">
             <FiZap className="text-indigo-500" />
             <span>UPLINK: ACTIVE</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-full animate-pulse"></div>
           </div>
           <span className="text-[10px] font-black text-indigo-500">INIT: 100%</span>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 bg-black/60 border border-white/5 rounded-lg overflow-hidden shadow-[0_0_80px_-20px_rgba(79,70,229,0.15)] backdrop-blur-3xl">
          
          {/* LEFT: SYSTEM STATS / INFO */}
          <div className="hidden lg:flex lg:col-span-5 p-16 flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors duration-700"></div>
            
            <div className="relative z-10 space-y-10">
              <div className="inline-flex p-5 rounded-lg bg-white/5 border border-white/10 shadow-inner">
                <FiCpu className="text-indigo-600" size={36} />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter text-white leading-tight uppercase italic">
                  FACULTY <br/>
                  <span className="text-indigo-600">COMMAND</span>
                </h1>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] leading-loose">
                  Pedagogical Management Gateway. Access Academic Protocols, Student Registries, and Curriculumn Matrix.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 space-y-2">
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Sync Latency</div>
                   <div className="text-2xl font-black text-indigo-400 italic">12ms</div>
                </div>
                <div className="p-6 rounded-lg bg-white/5 border border-white/5 space-y-2">
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Node Status</div>
                   <div className="text-2xl font-black text-slate-200 italic tracking-tighter uppercase">Online</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-10">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center bg-white/5">
                     <FiShield className="text-indigo-500" size={20} />
                  </div>
                  <div className="text-[9px] font-black tracking-[0.3em] text-slate-500 leading-tight uppercase italic">
                     SECURE <br/> FACULTY_HANDSHAKE
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: LOGIN FORM */}
          <div className="lg:col-span-7 bg-white/[0.02] p-8 sm:p-16 xl:p-24 border-l border-white/5">
            <div className="max-w-md w-full mx-auto">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 rounded-r-[2.5rem]">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              )}

              <div className="mb-14 space-y-4">
                <div className="inline-block px-4 py-1.5 bg-indigo-600/10 text-indigo-500 rounded-lg text-[9px] font-black tracking-[0.3em] uppercase border border-indigo-600/20 italic">
                  Uplink Authentication
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Execute Login</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Access the pedagogical infrastructure layer.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1 italic">Faculty Identifier (Mobile)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-600 transition-colors">
                      <FiSmartphone size={18} />
                    </div>
                    <input
                      type="tel"
                      name="moNumber"
                      placeholder="0000000000"
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-lg focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white/10 outline-none transition-all text-white font-black tracking-widest placeholder:text-slate-800 text-sm italic"
                      value={loginData.moNumber}
                      onChange={handleChange}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Access Key</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-600 transition-colors">
                      <FiLock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-14 pr-16 py-5 bg-white/5 border border-white/10 rounded-lg focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 focus:bg-white/10 outline-none transition-all text-white font-black tracking-widest placeholder:text-slate-800 text-sm"
                      value={loginData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center space-x-3 group cursor-pointer">
                      <div className="w-2 h-2 rounded-full border border-indigo-600 group-hover:bg-indigo-600 transition-all"></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-500 transition-colors italic">Trust Node</span>
                   </div>
                   <NavLink
                    to="/forgot-password"
                    className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white cursor-pointer transition-colors italic">
                    Key Recovery
                   </NavLink>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-lg shadow-[0_20px_50px_-15px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:opacity-50 italic flex items-center justify-center gap-4"
                >
                  {loading ? "LINKING TO HUB..." : (
                    <>
                        EXECUTE ACCESS
                        <FiArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER STATS */}
      <div className="h-12 border-t border-white/5 bg-black/40 flex items-center px-8 text-[9px] font-black text-slate-600 tracking-widest relative z-10 italic">
         <div className="flex-1 uppercase">FAC_SESSION_KEY: {Math.random().toString(16).slice(2, 10).toUpperCase()}</div>
         <div className="flex items-center space-x-8">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> HUB: STABLE</span>
            <span className="text-indigo-600">FAC_PORTAL_V4.0.2</span>
         </div>
      </div>
    </div>
  );
}

export default Login;



