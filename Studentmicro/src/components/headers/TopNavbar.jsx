import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { 
  FiChevronDown, 
  FiUser, 
  FiBell, 
  FiHome, 
  FiBook, 
  FiCheckSquare, 
  FiFileText, 
  FiGrid,
  FiActivity,
  FiShield,
  FiLogOut,
  FiMoon
} from "react-icons/fi";
import { authAPI } from "../../api/apis";

const TopNavbar = () => {
    const { student, userLooutData } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const profileRef = useRef(null);
    const navRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authAPI.post("/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error(err);
        } finally {
            userLooutData();
            navigate("/");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
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
            title: "Navigation",
            icon: <FiHome />,
            children: [
                { name: "Notices", route: "/Notice" },
            ],
        },
        {
            title: "Academic",
            icon: <FiBook />,
            children: [
                { name: "Homework", route: "/homework" },
                { name: "Assignments", route: "/assignment" },
                { name: "Model Papers", route: "/model-paper" },
                { name: "Syllabus", route: "/Syllbus" },
            ],
        },
        {
            title: "Performance",
            icon: <FiCheckSquare />,
            children: [
                { name: "Exam Results", route: "/result" },
                { name: "Exam Schedule", route: "/exam-schedule" },
                { name: "Time Table", route: "/timetable" },
                { name: "Attendance", route: "/attendance" },
                { name: "Online Class", route: "/online" },
                { name: "Placements", route: "/placements" },
            ],
        },
    ];

    return (
        <header className="h-[100px] bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm font-display">
            {/* Brand Section */}
            <div className="flex items-center gap-4">
                <div 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-all">
                        <FiShield size={26} strokeWidth={2.5} />
                    </div>
                    <div className="hidden lg:block text-left">
                        <h1 className="text-blue-900 font-black tracking-tighter uppercase italic text-xl leading-none">ITM STUDENT</h1>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Nexus Portal</p>
                    </div>
                </div>
            </div>

            {/* Center Navigation */}
            <nav className="hidden xl:flex items-center gap-1" ref={navRef}>
                {menuItems.map((menu, index) => {
                    const isActive = location.pathname === menu.route || menu.children?.some(c => location.pathname === c.route);
                    
                    return (
                        <div key={index} className="relative px-2">
                            {menu.children ? (
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                                        className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 ${
                                            isActive || activeMenu === menu.title 
                                                ? "text-blue-600 scale-110" 
                                                : "text-slate-400 hover:text-slate-600"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                            isActive || activeMenu === menu.title ? "bg-blue-50 shadow-inner" : ""
                                        }`}>
                                            <span className="text-2xl">{menu.icon}</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                                            {menu.title}
                                        </span>
                                    </button>

                                    {activeMenu === menu.title && (
                                        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-50 p-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                                            {menu.children.map((child) => (
                                                <NavLink
                                                    key={child.route}
                                                    to={child.route}
                                                    onClick={() => setActiveMenu(null)}
                                                    className={({ isActive }) =>
                                                        `block px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${
                                                            isActive ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
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
                                    className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 ${
                                        isActive ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                        isActive ? "bg-blue-50 shadow-inner" : ""
                                    }`}>
                                        <span className="text-2xl">{menu.icon}</span>
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

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all cursor-pointer">
                        <FiMoon size={20} />
                    </div>
                    
                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={`w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                                isProfileOpen ? "ring-4 ring-blue-50" : ""
                            }`}
                        >
                            <span className="text-sm font-black italic uppercase">{student?.name?.[0] || <FiUser />}</span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-4 animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">
                                <div className="p-4 mb-3 bg-slate-50 rounded-2xl text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl border-4 border-white uppercase italic">
                                        {student?.name?.[0] || "S"}
                                    </div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase italic truncate">
                                        {student?.name}
                                    </h3>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">{student?.course}</p>
                                </div>

                                <div className="p-4 space-y-2 border-b border-slate-50 mb-2">
                                    <div className="flex justify-between items-center text-[9px] font-black italic">
                                        <span className="text-slate-400 uppercase tracking-widest">Section</span>
                                        <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{student?.section || "N/A"}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px] italic group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiLogOut size={18} />
                                        <span>Sign Out</span>
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



