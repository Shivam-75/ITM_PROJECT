import React, { useState, useEffect } from "react";
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

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
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
            scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border-b border-white/20' : 'bg-transparent'
        }`}>
            <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center justify-between gap-4">
                
                {/* Brand Section */}
                <div 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-4 cursor-pointer group shrink-0"
                >
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                        ITM
                    </div>
                    <div className="hidden xl:block">
                        <span className="text-black font-black tracking-tight uppercase text-xl leading-none block group-hover:translate-x-1 transition-transform">Student Hub</span>
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.4em] mt-1 block">Academic Portal</span>
                    </div>
                </div>

                {/* Center Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navMenus.map((menu) => (
                        <div key={menu.title} className="relative">
                            {menu.children ? (
                                <button
                                    onMouseEnter={() => setActiveMenu(menu.title)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                        activeMenu === menu.title ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-500 hover:bg-white hover:text-black'
                                    }`}
                                >
                                    <span className="text-base opacity-70">{menu.icon}</span>
                                    {menu.title}
                                    <FiChevronDown className={`transition-transform duration-500 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <NavLink
                                    to={menu.route}
                                    className={({ isActive }) => 
                                        `flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                            isActive ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-500 hover:bg-white hover:text-black'
                                        }`
                                    }
                                >
                                    <span className="text-base opacity-70">{menu.icon}</span>
                                    {menu.title}
                                </NavLink>
                            )}

                            {activeMenu === menu.title && menu.children && (
                                <div 
                                    onMouseLeave={() => setActiveMenu(null)}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-2 z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
                                >
                                    {menu.children.map((child) => (
                                        <NavLink
                                            key={child.route}
                                            to={child.route}
                                            onClick={() => setActiveMenu(null)}
                                            className={({ isActive }) => 
                                                `flex items-center gap-4 px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                                                    isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
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
                    <div className="text-right hidden sm:block border-r border-slate-100 pr-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">
                            {student?.name || "Student"}
                        </h4>
                        <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest flex items-center justify-end gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> 
                            {student?.course || "Scholar"}
                        </p>
                    </div>

                    <div className="relative">
                        <div 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-xs font-black shadow-xl cursor-pointer hover:scale-105 transition-transform"
                        >
                            {student?.name?.[0]}
                        </div>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[1.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-500">
                                    <div className="p-6 bg-black text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl font-black shadow-xl">
                                                {student?.name?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black tracking-tight leading-none mb-1">{student?.name}</h3>
                                                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{student?.roll_no}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest italic"
                                        >
                                            <FiLogOut />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;

