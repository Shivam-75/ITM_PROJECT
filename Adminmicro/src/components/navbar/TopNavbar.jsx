import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  FiSettings,
  FiChevronDown,
  FiLogOut
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
        { name: "Hostel Fee", route: "/hostel/fee-registry" },
      ],
    },
    {
      title: "Hostel",
      icon: <FiHome />,
      children: [
        { name: "Dashboard", route: "/hostel" },
        { name: "Rooms", route: "/hostel/rooms" },
        { name: "Students", route: "/hostel/students" },
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
        { name: "Dashboard", route: "/exams" },
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
  <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    {/* Brand */}
    <div className="flex items-center gap-8">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200 group-hover:scale-110 transition-all">
          ITM
        </div>
        <div className="hidden lg:block">
          <span className="text-gray-900 font-black tracking-tighter uppercase italic text-lg leading-none block">Admin</span>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Command Center</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden xl:flex items-center gap-2" ref={navRef}>
        {menuItems.map((menu) => (
          <div key={menu.title} className="relative">
            {menu.children ? (
              <div>
                <button
                  onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest italic transition-all ${activeMenu === menu.title ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-white'
                    }`}
                >
                  <span className="text-lg">{menu.icon}</span>
                  {menu.title}
                  <FiChevronDown className={`transition-transform duration-300 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === menu.title && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {menu.children.map((child) => (
                      <NavLink
                        key={child.route}
                        to={child.route}
                        onClick={() => setActiveMenu(null)}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-white'
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={menu.route}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest italic transition-all ${isActive ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-white'
                  }`
                }
              >
                <span className="text-lg">{menu.icon}</span>
                {menu.title}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>

    {/* Right Controls */}
    <div className="flex items-center gap-6">
      {/* Notifications */}
      <div className="relative p-3 bg-white text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer group">
        <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
      </div>

      {/* Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="text-right hidden sm:block">
            <h4 className="text-[11px] font-black text-gray-900 uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
              {userProfileData?.name || "Administrator"}
            </h4>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {userProfileData?.mobNumber || "Master Admin"}
            </p>
          </div>
          <div className={`w-11 h-11 bg-[#111111] rounded-lg flex items-center justify-center text-white ring-4 ring-gray-100 shadow-sm relative overflow-hidden transition-all group-hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-red-100' : ''}`}>
            {userProfileData?.name ? (
              <span className="text-sm font-black italic uppercase">{userProfileData.name[0]}</span>
            ) : (
              <FiShield size={18} className="text-red-500" />
            )}
          </div>
        </div>

        {isProfileOpen && (
          <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="p-3 mb-2 bg-white rounded-lg">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Logged in as</p>
              <h3 className="text-xs font-black text-gray-900 uppercase italic tracking-tight truncate">{userProfileData?.name}</h3>
            </div>
            <button
              onClick={() => { setIsProfileOpen(false); navigate("/profile"); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-white hover:text-red-600 transition-all font-black uppercase tracking-widest text-[10px] italic"
            >
              <FiUser size={18} />
              <span>My Profile</span>
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-all font-black uppercase tracking-widest text-[10px] italic"
            >
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
);
};

export default TopNavbar;




