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
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-black border border-gray-200 rounded-lg shadow-sm"
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
        className={`fixed top-0 left-0 h-screen bg-white text-black z-40 transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200
        ${isSidebarOpen ? "w-64 translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-64"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-lg font-bold">ITM</div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Student Hub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-9 scrollbar-hide">
          {menuItems.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.route}
                    onClick={handleLinkClick}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded transition-all duration-200 group relative
                      ${isActive
                        ? "bg-gray-50 text-black font-extrabold border-l-4 border-black pl-3"
                        : "hover:bg-gray-50 text-gray-500 hover:text-black"}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={LogoutUser}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded bg-white text-black hover:bg-black hover:text-white transition-all duration-300 font-bold border border-gray-200 shadow-sm"
          >
            <FiLogOut className="text-lg" />
            <span className="text-[10px] uppercase tracking-[0.2em]">Logout Session</span>
          </button>
        </div>

        {loading && (
          <div className="absolute bottom-20 right-4 animate-spin opacity-20">
            <SmallLoader />
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
