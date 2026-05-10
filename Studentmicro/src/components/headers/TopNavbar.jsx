import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { 
  FiChevronDown, 
  FiUser, 
  FiBell, 
  FiHome, 
  FiBook, 
  FiCheckSquare, 
  FiFileText, 
  FiTrello, 
  FiCalendar, 
  FiClock, 
  FiVideo,
  FiLogOut
} from "react-icons/fi";
import { authAPI } from "../../api/apis";

const TopNavbar = () => {
    const { student, userLooutData } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const profileRef = useRef(null);
    const navRef = useRef(null);
    const navigate = useNavigate();

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
            title: "Navigation",
            icon: <FiHome />,
            children: [
                { name: "Dashboard", route: "/" },
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
        <header className="w-full h-16 bg-white border-b border-gray-200 z-50 sticky top-0 shadow-sm">
            <div className="h-full px-8 flex items-center justify-between">
                
                {/* Brand & Nav */}
                <div className="flex items-center gap-8">
                    <div 
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-9 h-9 bg-[#111111] rounded-lg flex items-center justify-center text-white font-black italic shadow-lg group-hover:scale-110 transition-all">
                            ITM
                        </div>
                        <div className="hidden lg:block">
                            <span className="text-gray-900 font-black tracking-tighter uppercase italic text-sm leading-none block">Student Hub</span>
                            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest mt-0.5">Academic Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden xl:flex items-center gap-2" ref={navRef}>
                        {menuItems.map((menu) => (
                            <div key={menu.title} className="relative">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === menu.title ? null : menu.title)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all ${
                                        activeMenu === menu.title ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-white'
                                    }`}
                                >
                                    <span className="text-lg">{menu.icon}</span>
                                    {menu.title}
                                    <FiChevronDown className={`transition-transform duration-300 ${activeMenu === menu.title ? 'rotate-180' : ''}`} />
                                </button>

                                {activeMenu === menu.title && (
                                    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-lg shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {menu.children.map((child) => (
                                            <NavLink
                                                key={child.route}
                                                to={child.route}
                                                onClick={() => setActiveMenu(null)}
                                                className={({ isActive }) => 
                                                    `block px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic transition-all ${
                                                        isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-white'
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
                    
                    <button className="p-2 text-gray-400 hover:text-red-600 transition relative">
                        <FiBell size={20} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full border border-white"></span>
                    </button>

                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 rounded-full transition active:scale-95 group"
                        >
                            <div className={`w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white font-black shadow-xl ring-4 ring-transparent transition-all group-hover:ring-red-50 ${isProfileOpen ? 'ring-red-50 shadow-red-100' : ''}`}>
                                {student?.name?.[0] || <FiUser />}
                            </div>
                            <div className="hidden md:block text-left border-l border-gray-100 pl-3">
                                <p className="text-[10px] font-black text-black uppercase tracking-tight leading-none italic">{student?.name}</p>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{student?.course}</p>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                <div className="p-6 text-center border-b border-gray-100 mb-2">
                                    <div className="w-16 h-16 rounded-lg bg-black text-white flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-xl border-4 border-gray-50 uppercase italic">
                                        {student?.name ? student.name.charAt(0) : <FiUser />}
                                    </div>
                                    <h3 className="font-black text-black text-xs uppercase tracking-tight italic">{student?.name || "Student User"}</h3>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">{student?.course || "No Course"}</p>
                                </div>
                                
                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-center text-[9px] font-black italic">
                                        <span className="text-gray-400 uppercase tracking-widest">Section</span>
                                        <span className="text-red-600 bg-red-50 px-3 py-1 rounded-lg">{student?.section || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-black italic">
                                        <span className="text-gray-400 uppercase tracking-widest">Contact</span>
                                        <span className="text-black">{student?.moNumber || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-black uppercase tracking-widest text-[10px] italic"
                                    >
                                        <FiLogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;



