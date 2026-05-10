import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiMenu, FiUser, FiSettings, FiShield } from "react-icons/fi";
import { authAPI } from "../../api/apis";

const TopNavbar = ({ onMenuClick }) => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.get("/login", { withCredentials: true });
      setUserProfileData(data?.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Mobile Toggle */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2.5 bg-gray-50 text-gray-800 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
      >
        <FiMenu size={20} />
      </button>

      {/* Session Status - Desktop Only */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full border border-red-100">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-700 italic">Secure Session: Active</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Notifications */}
        <div 
          className="relative p-3 bg-gray-50 text-gray-400 hover:text-red-600 rounded-2xl hover:bg-red-50 transition-all group cursor-pointer"
        >
          <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
        </div>

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
           <div 
             className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group"
             onClick={() => setIsProfileOpen(!isProfileOpen)}
           >
              <div className="text-right hidden sm:block">
                  <h4 className="text-xs font-black text-gray-900 uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
                    {userProfileData?.name || "Administrator"}
                  </h4>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    {userProfileData?.mobNumber || "Master Admin"}
                  </p>
              </div>
              <div className={`w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center text-white ring-4 ring-gray-100 shadow-sm relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-red-100' : ''}`}>
                   {userProfileData?.name ? (
                       <span className="text-sm font-black italic uppercase">{userProfileData.name[0]}</span>
                   ) : (
                       <FiShield size={18} className="text-red-500" />
                   )}
              </div>
           </div>

           {/* Dropdown Menu */}
           {isProfileOpen && (
             <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 transform origin-top-right">
                <div className="space-y-1">
                    <div className="p-3 mb-2 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Logged in as</p>
                        <h3 className="text-sm font-black text-gray-900 uppercase italic tracking-tight truncate">{userProfileData?.name}</h3>
                    </div>

                    <button 
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all font-bold uppercase tracking-wide text-xs"
                    >
                        <FiUser size={18} />
                        <span>My Profile</span>
                    </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
