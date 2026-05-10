import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiInfo,
  FiHash,
  FiAward,
  FiGrid,
  FiClock,
  FiBook,
  FiEdit3,
  FiStar,
  FiUsers,
  FiFileText,
  FiHome,
  FiVideo,
  FiChevronDown,
  FiLogOut
} from "react-icons/fi";
import { authAPI } from "../api/apis";
import useAuth from "../../store/FacultyStore";

const TopNavbar = () => {
  const [teacherProfile, setTeacherProfile] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { userLogoutData } = useAuth();

  const handleLogout = async () => {
    try {
      await authAPI.post("/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      userLogoutData();
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
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      title: "Academic",
      icon: <FiGrid />,
      children: [
        { name: "Dashboard", route: "/" },
        { name: "Live Schedule", route: "/timetable" },
      ],
    },
    {
      title: "Coursework",
      icon: <FiBook />,
      children: [
        { name: "Homework", route: "/homework" },
        { name: "Assignments", route: "/assignment" },
        { name: "Notice Board", route: "/notice" },
        { name: "Model Papers", route: "/model-paper" },
        { name: "Virtual Class", route: "/online" },
      ],
    },
    {
      title: "Exams",
      icon: <FiEdit3 />,
      children: [
        { name: "Exam Schedule", route: "/exam-schedule" },
      ],
    },

    {
      title: "Management",
      icon: <FiUsers />,
      children: [

        { name: "Daily Attendance", route: "/attendance" },
        { name: "Grade Entries", route: "/results" },
        { name: "Result Registry", route: "/result-list" },
      ],
    },

  ];

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Nav */}
      <div className="flex items-center gap-8">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-lg font-black italic shadow-lg shadow-slate-200 group-hover:scale-110 transition-all">
            F
          </div>
          <div className="hidden lg:block">
            <span className="text-slate-900 font-black tracking-tighter uppercase italic text-lg leading-none block">Faculty</span>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Digital Portal</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-2" ref={navRef}>
          {menuItems.map((menu) => (
            <div key={menu.title} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest italic transition-all ${activeMenu === menu.title ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-white'
                  }`}
              >
                <span className="text-lg">{menu.icon}</span>
                {menu.title}
                <FiChevronDown className={`transition-transform duration-300 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
              </button>

              {activeMenu === menu.title && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-slate-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {menu.children.map((child) => (
                    <NavLink
                      key={child.route}
                      to={child.route}
                      onClick={() => setActiveMenu(null)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-white'
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <NavLink
          to="/notifications"
          className="relative p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all group"
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
              <h4 className="text-[11px] font-black text-slate-800 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                {teacherProfile?.name || "Faculty Member"}
              </h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {teacherProfile?.role || "Department head"}
              </p>
            </div>
            <div className={`w-11 h-11 bg-slate-900 rounded-lg flex items-center justify-center text-white ring-4 ring-slate-100 shadow-sm relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-indigo-100' : ''}`}>
              {teacherProfile?.name ? (
                <span className="text-sm font-black italic uppercase">{teacherProfile.name[0]}</span>
              ) : (
                <FiUser size={18} />
              )}
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-lg shadow-2xl shadow-indigo-200/50 border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Verified</p>
                  <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{teacherProfile?.name}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <FiInfo size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                      <p className="text-[11px] font-bold text-slate-800 uppercase italic">{teacherProfile?.course || "Engineering"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <FiHash size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Year Assignment</p>
                      <p className="text-[11px] font-bold text-slate-800 uppercase italic">Year - {teacherProfile?.year || "1"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <FiAward size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Role Authority</p>
                      <p className="text-[11px] font-bold text-slate-800 uppercase italic">{teacherProfile?.role || "Faculty"}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px] italic"
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
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



