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
            <div className="max-w-[1440px] mx-auto h-full px-8 flex items-center justify-between">
                
                {/* Brand & Nav */}
                <div className="flex items-center gap-16">
                    <div 
                        onClick={() => navigate("/")}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                            ITM
                        </div>
                        <div className="hidden lg:block">
                            <span className="text-black font-black tracking-tight uppercase text-2xl leading-none block group-hover:translate-x-1 transition-transform">Student Hub</span>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mt-1.5 block">Academic Portal</span>
                        </div>
                    </div>
                </div>
            </div>

                    <nav className="hidden lg:flex items-center gap-2">
                        {navMenus.map((menu) => (
                            <div key={menu.title} className="relative">
                                <button
                                    onMouseEnter={() => setActiveMenu(menu.title)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                                        activeMenu === menu.title ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-500 hover:bg-white hover:text-black'
                                    }`}
                                >
                                    <span className="text-lg opacity-70">{menu.icon}</span>
                                    {menu.title}
                                    <FiChevronDown className={`transition-transform duration-500 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
                                </button>

                                {activeMenu === menu.title && (
                                    <div 
                                        onMouseLeave={() => setActiveMenu(null)}
                                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-3 z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
                                    >
                                        <div className="p-4 mb-2 border-b border-gray-50">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Module</p>
                                        </div>
                                        {menu.children.map((child) => (
                                            <NavLink
                                                key={child.route}
                                                to={child.route}
                                                onClick={() => setActiveMenu(null)}
                                                className={({ isActive }) => 
                                                    `flex items-center gap-4 px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                                                        isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                                    }`
                                                }
                                            >
                                                <span className="opacity-70">{child.icon}</span>
                                                {child.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                        {menu.title}
                                    </span>
                                </NavLink>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block border-r border-slate-100 pr-6 mr-2">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight mb-0.5">
                        {student?.name || "Student"}
                    </h4>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest flex items-center justify-end gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                        {student?.course || "Scholar"}
                    </p>
                </div>

                {/* Right Profile */}
                <div className="flex items-center gap-8">
                    <button className="p-4 bg-white/50 backdrop-blur-xl text-black rounded-2xl hover:bg-black hover:text-white transition-all relative group shadow-sm border border-white/50">
                        <FiBell size={22} className="group-hover:rotate-12 transition-transform" />
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                    </button>
                    
                    <div className="flex items-center gap-5 pl-8 border-l border-gray-100">
                        <div className="flex flex-col items-end hidden md:flex">
                            <p className="text-[11px] font-black text-black uppercase tracking-tight leading-none">{student?.name}</p>
                            <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-[0.2em] mt-1">{student?.course}</p>
                        </div>
                        
                        {/* Profile Dropdown Container */}
                        <div className="relative">
                            <div 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="relative group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center text-sm font-black shadow-2xl group-hover:scale-105 transition-transform border-4 border-transparent hover:border-rose-100">
                                    {student?.name?.[0]}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-white shadow-sm"></div>
                            </div>

                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-6 w-[340px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden z-20 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
                                        {/* Profile Card Header */}
                                        <div className="p-8 bg-black text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                            <div className="flex items-center gap-5 relative z-10">
                                                <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">
                                                    {student?.name?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight leading-none mb-1.5">{student?.name}</h3>
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{student?.roll_no || "STU-2024-001"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profile Details */}
                                        <div className="p-8 space-y-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Course</p>
                                                    <p className="text-xs font-black text-black">{student?.course}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Semester</p>
                                                    <p className="text-xs font-black text-black">{student?.semester || "4TH"}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Academic Mastery</p>
                                                    <p className="text-[10px] font-black text-rose-500">85%</p>
                                                </div>
                                                <div className="h-2 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                                                    <div className="h-full w-[85%] bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/20"></div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <FiUser className="text-gray-400 group-hover:text-rose-500" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">Edit Profile</span>
                                                    </div>
                                                    <FiChevronDown className="-rotate-90 text-gray-300" />
                                                </button>
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-2xl transition-all group shadow-sm shadow-rose-500/5"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FiLogOut className="group-hover:translate-x-1 transition-transform" />
                                                        <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="p-4 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all shadow-sm group"
                            title="Sign Out"
                        >
                            <FiLogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;

