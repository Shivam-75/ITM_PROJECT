import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiBell, FiMenu, FiUser, FiInfo, FiHash, FiAward } from "react-icons/fi";
import { authAPI } from "../api/apis";

const TopNavbar = ({ onMenuClick }) => {
  const [teacherProfile, setTeacherProfile] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.get("/userProfile");
      setTeacherProfile(data?.userData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile Toggle */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2.5 bg-slate-50 text-slate-800 rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
      >
        <FiMenu size={20} />
      </button>

      {/* Hero Badge - Desktop Only */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 italic">Academic Session Active</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 md:gap-8">
        
        {/* Notifications */}
        <NavLink 
          to="/notifications" 
          className="relative p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all group"
        >
          <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 border-4 border-white text-white text-[8px] font-black flex items-center justify-center rounded-full leading-none">
            3
          </span>
        </NavLink>

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
           <div 
             className="flex items-center gap-4 pl-4 border-l border-slate-100 cursor-pointer group"
             onClick={() => setIsProfileOpen(!isProfileOpen)}
           >
              <div className="text-right hidden sm:block">
                  <h4 className="text-xs font-black text-slate-800 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                    {teacherProfile?.name || "Faculty Member"}
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {teacherProfile?.role || "Department head"}
                  </p>
              </div>
              <div className={`w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white ring-4 ring-slate-100 shadow-sm relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-indigo-100' : ''}`}>
                   {teacherProfile?.name ? (
                       <span className="text-sm font-black italic uppercase">{teacherProfile.name[0]}</span>
                   ) : (
                       <FiUser size={18} />
                   )}
              </div>
           </div>

           {/* PREMIUM DROPDOWN */}
           {isProfileOpen && (
             <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 transform origin-top-right">
                <div className="space-y-6">
                    <div className="pb-4 border-b border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Verified</p>
                        <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{teacherProfile?.name}</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <FiInfo size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                                <p className="text-[11px] font-bold text-slate-800 uppercase italic">{teacherProfile?.course || "Engineering"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <FiHash size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Year Assignment</p>
                                <p className="text-[11px] font-bold text-slate-800 uppercase italic">Year - {teacherProfile?.year || "1"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                                <FiAward size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role Authority</p>
                                <p className="text-[11px] font-bold text-slate-800 uppercase italic">{teacherProfile?.role || "Faculty"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                         <button className="w-full py-3 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all italic">
                            Edit Professional Profile
                         </button>
                    </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
