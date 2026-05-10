import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FiGrid, FiEdit3, FiBook, FiFileText, 
  FiClock, FiVideo, FiUsers, FiAward, 
  FiHome, FiStar, FiChevronRight, FiX, FiLogOut 
} from "react-icons/fi";
import useAuth from "../../store/FacultyStore";
import { authAPI } from "../api/apis";
import { toast } from "react-toastify";

const Sidebar = ({ onClose }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const { userLogoutData, toststyle } = useAuth();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authAPI.patch("/Logout");
      userLogoutData();
      toast.success("User Logout Successfully !!", toststyle);
    } catch (err) {
      console.log(err);
      userLogoutData();
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = [
    {
      title: "Academic Navigation",
      items: [
        { name: "Faculty Dashboard", route: "/", icon: <FiGrid /> },
        { name: "Live Schedule", route: "/timetable", icon: <FiClock /> },
      ],
    },
    {
      title: "Course Work",
      items: [
        { name: "Homework Room", route: "/homework", icon: <FiBook /> },
        { name: "Assignment Desk", route: "/assignment", icon: <FiEdit3 /> },
        { name: "Notice Board", route: "/notice", icon: <FiStar /> },
      ],
    },
    {
      title: "Management",
      items: [

        { name: "Daily Attendance", route: "/attendance", icon: <FiFileText /> },
        { name: "Grade Entries", route: "/results", icon: <FiAward /> },
      ],
    },

  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white text-black border-r border-gray-200 shadow-sm animate-in slide-in-from-left-4 duration-500">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-slate-200">f</div>
          <span className="font-black text-lg tracking-tighter text-slate-900 uppercase italic">Faculty Portal</span>
        </div>
        
        {onClose && (
            <button 
                onClick={onClose}
                className="lg:hidden p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
            >
                <FiX size={20} />
            </button>
        )}
      </div>

      {/* Nav Content */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-9 scrollbar-hide">
        {menuItems.map((category) => (
          <div key={category.title} className="space-y-3">
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold italic">
              {category.title}
            </h3>
            <div className="space-y-1">
              {category.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.route}
                  onClick={handleLinkClick}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 group relative
                    ${isActive 
                      ? "bg-slate-900 text-white font-black shadow-xl shadow-slate-200 translate-x-1" 
                      : "hover:bg-white text-slate-500 hover:text-slate-900 font-bold"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`}>
                            {item.icon}
                        </span>
                        <span className="text-xs uppercase tracking-tight">{item.name}</span>
                      </div>
                      <FiChevronRight className={`text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'hidden' : 'block'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Action Footer */}
      <div className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-lg bg-white text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-500 font-black border border-gray-200 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <FiLogOut className="text-lg" />
              <span className="text-[10px] uppercase tracking-[0.4em] italic">{loggingOut ? "Exiting..." : "Logout Session"}</span>
            </button>
      </div>
    </div>
  );
};

export default Sidebar;



