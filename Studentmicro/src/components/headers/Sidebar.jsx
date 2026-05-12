import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { authAPI } from "../../api/apis";
import { toast } from "react-toastify";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiBell,
  FiBook,
  FiCheckSquare,
  FiFileText,
  FiTrello,
  FiCalendar,
  FiClock,
  FiVideo
} from "react-icons/fi";
import SmallLoader from "../common/SmallLoader";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toaststyle, userLooutData, loading } = useAuth();

  const menuItems = [
    {
      title: "Navigation",
      items: [
        { name: "Dashboard", route: "/", icon: <FiHome /> },
        { name: "Notices", route: "/Notice", icon: <FiBell /> },
      ],
    },
    {
      title: "Academic Work",
      items: [
        { name: "Homework", route: "/homework", icon: <FiBook /> },
        { name: "Assignments", route: "/assignment", icon: <FiCheckSquare /> },
        { name: "Model Papers", route: "/model-paper", icon: <FiFileText /> },
        { name: "Course Syllabus", route: "/Syllbus", icon: <FiTrello /> },
      ],
    },
    {
      title: "Performance",
      items: [
        { name: "Exam Results", route: "/result", icon: <FiCalendar /> },
        { name: "Exam Schedule", route: "/exam-schedule", icon: <FiCalendar /> },
        { name: "Time Table", route: "/timetable", icon: <FiClock /> },
        { name: "Online Classes", route: "/online", icon: <FiVideo /> },
        { name: "Attendance", route: "/attendance", icon: <FiFileText /> },
      ],
    },
  ];

  const LogoutUser = async () => {
    userLooutData();
    toast.success("User Logout Successfully !!", toaststyle);
    try {
      await authAPI.patch("/Logout");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-black border border-slate-100 rounded-lg shadow-sm"
        >
          <FiMenu size={24} />
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white text-gray-900 z-40 transition-all duration-300 ease-in-out flex flex-col border-r border-slate-100
        ${isSidebarOpen ? "w-64 translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-64"}`}
      >
        {/* Branding Section */}
        <div className="h-24 flex items-center px-8 border-b border-slate-50 bg-white/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center text-xs font-black italic tracking-tighter shadow-lg shadow-gray-200">
                ITM
            </div>
            <div className="flex flex-col">
                <span className="font-black text-xs uppercase italic tracking-tighter text-gray-900">Student <span className="text-red-600">Hub</span></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-0.5">Academic Portal v4.0</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-10 scrollbar-hide">
          {menuItems.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="px-4 text-[9px] uppercase tracking-[0.3em] text-gray-300 font-black italic">
                {category.title}
              </h3>
              <div className="space-y-1.5">
                {category.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.route}
                    onClick={handleLinkClick}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative
                      ${isActive
                        ? "bg-red-50 text-red-600 shadow-sm"
                        : "hover:bg-white text-gray-400 hover:text-gray-900"}
                    `}
                  >
                    <span className={`text-lg transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-widest italic transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.name}
                    </span>
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-600 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.4)]"></div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 bg-white/50 border-t border-slate-50">
          <button
            onClick={LogoutUser}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-[#111111] text-white hover:bg-red-600 transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-gray-200 group italic active:scale-95"
          >
            <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform" />
            <span>Terminate Session</span>
          </button>
        </div>

        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin opacity-20">
            <SmallLoader />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;



