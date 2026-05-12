import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiShield,
  FiGrid,
  FiBookOpen,
  FiDollarSign,
  FiClipboard,
  FiHome,
  FiUserPlus,
  FiLogOut,
  FiMoon,
  FiLayout,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiUsers,
  FiHash,
  FiSettings
} from "react-icons/fi";
import { authAPI } from "../../api/apis";
import useAuth from "../../store/AdminStore";

const TopNavbar = () => {
  const [userProfileData, setUserProfileData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
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
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiGrid />,
      route: "/",
    },
    {
      title: "Academic",
      icon: <FiBookOpen />,
      children: [
        { name: "Students", route: "/students" },
        { name: "Faculty", route: "/faculty" },
        { name: "Attendance", route: "/attendance-report" },
      ],
    },
    {
      title: "Finance",
      icon: <FiDollarSign />,
      children: [
        { name: "Academic Fee", route: "/fee-structure" },
      ],
    },
    {
      title: "Hostel",
      icon: <FiHome />,
      children: [
        { name: "Dashboard", route: "/hostel" },
        { name: "Hostel Fee Detail", route: "/hostel/students" },
      ],
    },
    {
      title: "Registrar",
      icon: <FiUserPlus />,
      children: [
        { name: "Admin Reg.", route: "/admin-registration" },
      ],
    },
    {
      title: "Exams",
      icon: <FiClipboard />,
      children: [
        { name: "Schedule", route: "/exam-schedule" },
        { name: "Results", route: "/results" },
        { name: "Placements", route: "/placements" },
      ],
    },
    {
      title: "System",
      icon: <FiSettings />,
      children: [
        { name: "Courses", route: "/admin/settings/courses" },
        { name: "Sections", route: "/sections" },
        { name: "Semesters", route: "/semesters" },
        { name: "Years", route: "/years" },
        { name: "Batches", route: "/batches" },
        { name: "Subjects", route: "/subjects" },
      ],
    },
  ];

  return (
    <header className="h-[100px] bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-4 shrink-0">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-16 h-12 bg-slate-900 rounded-[10px] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all relative overflow-hidden">
             <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
             <span className="text-[10px] font-black tracking-[0.2em] uppercase italic">Admin</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-slate-900 font-black tracking-tighter uppercase italic text-xl leading-none">ITMIAN <span className="text-blue-600">Pro.</span></h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Management Node</p>
          </div>
        </div>
      </div>

      {/* Center Navigation - Hover Dropdowns */}
      <nav className="flex items-center justify-center gap-1 mx-2 py-1 flex-nowrap" ref={navRef}>
        {menuItems.map((menu) => {
          const isActive = location.pathname === menu.route || menu.children?.some(c => location.pathname === c.route);
          
          return (
            <div 
              key={menu.title} 
              className="relative px-1 group/menu py-2"
              onMouseEnter={() => setActiveMenu(menu.title)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {menu.children ? (
                <div className="flex flex-col items-center">
                  <div
                    className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[70px] cursor-default ${
                      isActive || activeMenu === menu.title 
                        ? "text-blue-600 scale-105" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive || activeMenu === menu.title ? "bg-blue-50 shadow-inner" : ""
                    }`}>
                      <span className="text-lg">{menu.icon}</span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest italic leading-none">
                      {menu.title}
                    </span>
                  </div>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 w-52 pt-2 transition-all duration-300 z-50 origin-top ${
                    activeMenu === menu.title 
                      ? "opacity-100 visible translate-y-0 scale-100" 
                      : "opacity-0 invisible -translate-y-2 scale-95"
                  }`}>
                    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-50 p-2">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-l border-t border-slate-50"></div>
                      {menu.children.map((child) => (
                        <NavLink
                          key={child.route}
                          to={child.route}
                          onClick={() => setActiveMenu(null)}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${
                              isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to={menu.route}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-300 min-w-[70px] ${
                      isActive ? "text-blue-600 scale-105" : "text-slate-400 hover:text-slate-600"
                    }`
                  }
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? "bg-blue-50 shadow-inner" : ""
                  }`}>
                    <span className="text-lg">{menu.icon}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest italic leading-none">
                    {menu.title}
                  </span>
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-4 shrink-0">
        {/* User Profile Info */}
        <div className="text-right hidden sm:block border-r border-slate-100 pr-6 mr-2">
          <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">
            {userProfileData?.name || "Administrator"}
          </h4>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center justify-end gap-1">
            <FiActivity size={10} className="animate-pulse" /> Master Node
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all cursor-pointer">
            <FiMoon size={20} />
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                isProfileOpen ? "ring-4 ring-blue-50" : ""
              }`}
            >
              <FiUser size={22} />
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-4 animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">
                <div className="p-4 mb-3 bg-slate-50 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session ID</p>
                  <h3 className="text-xs font-black text-slate-900 uppercase italic truncate">
                    {userProfileData?.name || "Admin"}
                  </h3>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px] italic group"
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




