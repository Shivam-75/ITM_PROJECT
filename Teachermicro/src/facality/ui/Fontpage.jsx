import React from "react";
import { NavLink } from "react-router-dom";
import { FiCpu, FiSmartphone, FiShield } from "react-icons/fi";

const Fontpage = () => {
  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-mono flex flex-col selection:bg-red-500/30 selection:text-red-200 overflow-hidden relative">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)",
             backgroundSize: "40px 40px"
           }}>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/10 via-transparent to-transparent z-0 pointer-events-none"></div>

      {/* SYSTEM HEADER */}
      <div className="h-16 border-b border-white/5 flex items-center px-10 justify-between relative z-10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-black italic shadow-lg shadow-red-600/20">ITM</div>
          <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">Multi_Portal_Gateway</span>
        </div>
        <div className="flex items-center space-x-6 text-[10px] font-black text-slate-500 uppercase italic tracking-widest">
           <span className="text-red-600">SYS_STATUS: OPTIMIZED</span>
           <span>LINK: STABLE</span>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
              HUB <span className="text-red-600">SELECT</span>
           </h1>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Redirecting to authorized micro-service layers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full w-full">
          <NavLink
            to={"/faclity"}
            className="group relative p-12 bg-black/40 border border-white/5 rounded-[10px] flex flex-col items-center justify-center gap-8 hover:bg-white/5 transition-all duration-500 hover:border-red-600/30 hover:shadow-[0_0_50px_-10px_rgba(220,38,38,0.2)]"
          >
            <div className="w-20 h-20 rounded-[10px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
               <FiCpu size={40} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Faculty</h2>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-300 transition-colors">Pedagogical Command Center</p>
            </div>
            <div className="w-12 h-1 bg-red-600/20 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
          </NavLink>

          <NavLink
            to={"/Student"}
            className="group relative p-12 bg-black/40 border border-white/5 rounded-[10px] flex flex-col items-center justify-center gap-8 hover:bg-white/5 transition-all duration-500 hover:border-red-600/30 hover:shadow-[0_0_50px_-10px_rgba(220,38,38,0.2)]"
          >
            <div className="w-20 h-20 rounded-[10px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
               <FiSmartphone size={40} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Student</h2>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-300 transition-colors">Academic Learning Interface</p>
            </div>
            <div className="w-12 h-1 bg-red-600/20 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
          </NavLink>

          <NavLink
            to={"/Admin"}
            className="group relative p-12 bg-black/40 border border-white/5 rounded-[10px] flex flex-col items-center justify-center gap-8 hover:bg-white/5 transition-all duration-500 hover:border-red-600/30 hover:shadow-[0_0_50px_-10px_rgba(220,38,38,0.2)]"
          >
            <div className="w-20 h-20 rounded-[10px] bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
               <FiShield size={40} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">Admin</h2>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-slate-300 transition-colors">Core Infrastructure Control</p>
            </div>
            <div className="w-12 h-1 bg-red-600/20 rounded-full overflow-hidden">
               <div className="h-full bg-red-600 w-0 group-hover:w-full transition-all duration-700"></div>
            </div>
          </NavLink>
        </div>
      </main>

      {/* SYSTEM FOOTER */}
      <div className="h-12 border-t border-white/5 bg-black/40 flex items-center px-10 text-[9px] font-black text-slate-600 tracking-widest relative z-10 italic">
         <div className="flex-1 uppercase flex items-center gap-4">
            <span>&copy; 2024 ITM_GROUP_COLLEGE</span>
            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            <span>ENC_ENABLED: RSA_4096</span>
         </div>
         <div className="flex items-center space-x-8">
            <span className="text-red-600">V4.0.2_MASTER</span>
         </div>
      </div>
    </div>
  );
};

export default Fontpage;



