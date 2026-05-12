import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid, FiBook, FiEdit3, FiUsers,
  FiBell, FiUser, FiLogOut, FiChevronDown,
  FiInfo, FiHash, FiAward, FiShield, FiActivity, FiMoon,
  FiClock, FiCheckSquare, FiBookOpen
} from "react-icons/fi";
import { authAPI } from "../api/apis";
import useAuth from "../../store/FacultyStore";
import { toast } from "react-toastify";

const TopNavbar = () => {
  const [teacherProfile, setTeacherProfile] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userLogoutData, toststyle } = useAuth();

  const handleLogout = async () => {
    try {
      await authAPI.patch("/Logout");
    } catch (err) {
      console.error(err);
    } finally {
      userLogoutData();
      toast.success("User Logout Successfully !!", toststyle);
      navigate("/");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Dashboard", route: "/", icon: <FiGrid /> },
    { name: "Schedule", route: "/timetable", icon: <FiClock /> },
    { name: "Attendance", route: "/attendance", icon: <FiCheckSquare /> },
    { name: "Homework", route: "/homework", icon: <FiEdit3 /> },
    { name: "Assignments", route: "/assignment", icon: <FiBook /> },
    { name: "Notice", route: "/notice", icon: <FiBell /> },
    { name: "Papers", route: "/model-paper", icon: <FiBookOpen /> },
    { name: "Online", route: "/online", icon: <FiActivity /> },
    { name: "Exams", route: "/exam-schedule", icon: <FiAward /> },
    { name: "Grades", route: "/results", icon: <FiHash /> },

  ];

  return (
    <header className="h-[100px] bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-4 shrink-0">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-[#111111] rounded-[10px] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
            <span className="text-xl font-black italic">F</span>
          </div>
          <div className="hidden 2xl:block text-left">
            <h1 className="text-[#111111] font-black tracking-tighter uppercase italic text-xl leading-none">ITM FACULTY</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Digital Portal</p>
          </div>
        </div>
      </div>

      {/* Center Navigation - Flat Icons */}
      <nav className="flex items-center justify-center gap-0.5 overflow-x-auto no-scrollbar mx-2 py-1 flex-nowrap">
        {navLinks.map((link) => (
          <NavLink
            key={link.route}
            to={link.route}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1.5 rounded-[10px] transition-all duration-300 min-w-[60px] ${isActive
                ? "text-blue-600 scale-105"
                : "text-slate-400 hover:text-slate-600 hover:bg-white border border-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? "bg-white border border-slate-100 shadow-sm" : "bg-transparent"
                  }`}>
                  <span className="text-lg">{link.icon}</span>
                </div>
                <span className="text-[7px] font-black uppercase tracking-widest italic text-center leading-none">
                  {link.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-4 shrink-0">
        {/* User Profile Info */}
        <div className="text-right hidden xl:block border-r border-slate-100 pr-4 mr-2">
          <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">
            {teacherProfile?.name || "Faculty User"}
          </h4>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center justify-end gap-1">
            <FiActivity size={10} className="animate-pulse" /> {teacherProfile?.role || "Faculty Node"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-[10px] transition-all cursor-pointer">
            <FiMoon size={20} />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-12 h-12 bg-[#111111] text-white rounded-[10px] flex items-center justify-center shadow-lg transition-all active:scale-95 ${isProfileOpen ? "ring-4 ring-blue-50" : ""
                }`}
            >
              {teacherProfile?.name ? (
                <span className="text-sm font-black italic uppercase">{teacherProfile.name[0]}</span>
              ) : (
                <FiUser size={22} />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-4 animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">
                <div className="p-4 mb-3 bg-white border border-slate-100 rounded-[10px] text-center">
                  <div className="w-16 h-16 rounded-[10px] bg-[#111111] text-white flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl border-4 border-white uppercase italic">
                    {teacherProfile?.name?.[0] || "F"}
                  </div>
                  <h3 className="text-xs font-black text-slate-900 uppercase italic truncate">
                    {teacherProfile?.name || "Faculty"}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">{teacherProfile?.course}</p>
                </div>

                <div className="p-4 space-y-2 border-b border-slate-50 mb-2">
                  <div className="flex justify-between items-center text-[9px] font-black italic">
                    <span className="text-slate-400 uppercase tracking-widest">Dept</span>
                    <span className="text-blue-600 bg-white border border-slate-100 px-3 py-1 rounded-[10px]">{teacherProfile?.course || "N/A"}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-[10px] text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px] italic group"
                >
                  <div className="flex items-center gap-3">
                    <FiLogOut size={18} />
                    <span>Terminate Session</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <FiLogOut size={12} />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

