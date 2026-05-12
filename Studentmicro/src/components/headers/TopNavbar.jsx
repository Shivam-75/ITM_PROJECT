import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  FiChevronDown, FiBell, FiUser, FiLogOut, FiMenu, FiX,
  FiHome, FiBook, FiTrendingUp, FiCalendar, FiClock, FiAward,
  FiGrid, FiBriefcase, FiZap
} from "react-icons/fi";
import { useAuth } from "../../store/AuthStore";

const TopNavbar = () => {
    const { student, setuserLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    
    const navRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navMenus = [
        {
            title: "Dashboard",
            icon: <FiGrid />,
            route: "/",
        },
        {
            title: "Navigation",
            icon: <FiHome />,
            children: [
                { name: "Dashboard", route: "/", icon: <FiGrid size={14} /> },
                { name: "Time Table", route: "/timetable", icon: <FiClock size={14} /> },
                { name: "Attendance", route: "/attendance", icon: <FiTrendingUp size={14} /> },
                { name: "Exam Schedule", route: "/exam-schedule", icon: <FiCalendar size={14} /> },
            ]
        },
        {
            title: "Academic",
            icon: <FiBook />,
            children: [
                { name: "Syllabus", route: "/Syllbus", icon: <FiBook size={14} /> },
                { name: "Homework", route: "/homework", icon: <FiZap size={14} /> },
                { name: "Assignment", route: "/assignment", icon: <FiAward size={14} /> },
                { name: "Model Paper", route: "/model-paper", icon: <FiGrid size={14} /> },
            ]
        },
        {
            title: "Performance",
            icon: <FiTrendingUp />,
            children: [
                { name: "Results", route: "/result", icon: <FiAward size={14} /> },
                { name: "Placements", route: "/placements", icon: <FiBriefcase size={14} /> },
            ]
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("stLogged");
        setuserLogin(false);
        navigate("/");
    };

    return (
        <header className={`w-full h-24 z-50 sticky top-0 transition-all duration-500 ${
            scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-sm border-b border-slate-100' : 'bg-transparent'
        }`}>
            <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center justify-between gap-8">
                
                {/* Brand Section */}
                <div 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-4 cursor-pointer group shrink-0"
                >
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-xl group-hover:scale-105 transition-transform">
                        ITM
                    </div>
                    <div className="hidden xl:block">
                        <span className="text-black font-black tracking-tight uppercase text-xl leading-none block">Student Hub</span>
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] mt-1 block">Academic Portal</span>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="hidden lg:flex items-center gap-1" ref={navRef}>
                    {navMenus.map((menu) => (
                        <div key={menu.title} className="relative">
                            <button
                                onClick={() => {
                                    if (menu.children) {
                                        setActiveMenu(activeMenu === menu.title ? null : menu.title);
                                    } else {
                                        navigate(menu.route);
                                        setActiveMenu(null);
                                    }
                                }}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                    activeMenu === menu.title ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span className="text-base opacity-70">{menu.icon}</span>
                                {menu.title}
                                {menu.children && <FiChevronDown className={`transition-transform duration-500 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />}
                            </button>

                            {menu.children && activeMenu === menu.title && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300">
                                    {menu.children.map((child) => (
                                        <NavLink
                                            key={child.route}
                                            to={child.route}
                                            onClick={() => setActiveMenu(null)}
                                            className={({ isActive }) => 
                                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    isActive ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                                }`
                                            }
                                        >
                                            <span className="opacity-70">{child.icon}</span>
                                            {child.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block border-r border-slate-100 pr-4 mr-1">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">
                            {student?.name || "Student"}
                        </h4>
                        <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                            {student?.course || "Scholar"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white text-slate-400 hover:text-black rounded-xl transition-all relative border border-slate-100 shadow-sm">
                            <FiBell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                        </button>
                        
                        <div className="relative" ref={profileRef}>
                            <div 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg cursor-pointer hover:scale-105 transition-transform"
                            >
                                {student?.name?.[0] || <FiUser />}
                            </div>

                            {isProfileOpen && (
                                <>
                                    <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="p-5 bg-slate-900 text-white">
                                            <h3 className="text-xs font-black tracking-tight mb-1 uppercase">{student?.name}</h3>
                                            <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest">{student?.roll_no}</p>
                                        </div>
                                        <div className="p-3 space-y-1">
                                            <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                                                <FiUser className="text-slate-400 group-hover:text-black" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-black">Profile</span>
                                            </button>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-rose-50 rounded-xl transition-all group text-rose-500"
                                            >
                                                <FiLogOut />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
