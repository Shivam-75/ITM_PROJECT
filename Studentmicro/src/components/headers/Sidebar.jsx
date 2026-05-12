import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { authAPI } from "../../api/apis";
import { toast } from "react-toastify";
import {
  FiLogOut, FiMenu, FiX, FiHome, FiBell, FiBook,
  FiCheckSquare, FiFileText, FiTrello, FiCalendar,
  FiClock, FiVideo, FiGrid, FiTrendingUp, FiLayers, FiBriefcase
} from "react-icons/fi";
import SmallLoader from "../common/SmallLoader";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toaststyle, userLooutData, loading } = useAuth();

  const menuItems = [
    {
      title: "Core Navigation",
      items: [
        { name: "Dashboard", route: "/", icon: <FiGrid /> },
        { name: "Notices", route: "/Notice", icon: <FiBell /> },
      ],
    },
    {
      title: "Academic Hub",
      items: [
        { name: "Homework", route: "/homework", icon: <FiBook /> },
        { name: "Assignments", route: "/assignment", icon: <FiCheckSquare /> },
        { name: "Model Papers", route: "/model-paper", icon: <FiFileText /> },
        { name: "Syllabus", route: "/Syllbus", icon: <FiLayers /> },
      ],
    },
    {
      title: "Performance",
      items: [
        { name: "Exam Results", route: "/result", icon: <FiTrendingUp /> },
        { name: "Exam Schedule", route: "/exam-schedule", icon: <FiCalendar /> },
        { name: "Time Table", route: "/timetable", icon: <FiClock /> },
        { name: "Attendance", route: "/attendance", icon: <FiTrendingUp /> },
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
          className="lg:hidden fixed top-6 left-6 z-50 p-4 bg-black text-white rounded-2xl shadow-2xl"
        >
          <FiMenu size={24} />
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-md transition-all duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white z-40 transition-all duration-500 ease-in-out flex flex-col border-r border-slate-100 shadow-2xl shadow-black/[0.02]
        ${isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-72"}`}
      >
        {/* Branding Section */}
        <div className="h-28 flex items-center px-10 border-b border-gray-50 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-black shadow-2xl shadow-black/20 group-hover:rotate-6 transition-transform duration-500">
                ITM
            </div>
            <div className="flex flex-col">
                <span className="font-black text-sm uppercase tracking-tight text-black">Student <span className="text-rose-500">Hub</span></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 mt-1">Portal v4.0</span>
            </div>
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-gray-400 hover:text-black">
              <FiX size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-12 custom-scrollbar">
          {menuItems.map((category) => (
            <div key={category.title} className="space-y-5">
              <h3 className="px-5 text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">
                {category.title}
              </h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.route}
                    onClick={handleLinkClick}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                      ${isActive
                        ? "bg-black text-white shadow-xl shadow-black/10"
                        : "text-gray-400 hover:bg-gray-50 hover:text-black"}
                    `}
                  >
                    <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-rose-500'}`}>
                        {item.icon}
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.name}
                    </span>
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-rose-500 rounded-r-full shadow-[0_0_15px_rgba(244,114,182,0.6)]"></div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-8 bg-white border-t border-gray-50">
          <button
            onClick={LogoutUser}
            className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-[2rem] bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white transition-all duration-500 font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-xl hover:shadow-rose-500/20 group active:scale-95"
          >
            <FiLogOut className="text-xl group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out Portal</span>
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
            <SmallLoader />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;




