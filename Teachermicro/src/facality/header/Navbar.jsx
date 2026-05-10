import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import useAuth from "../../store/FacultyStore";
import Loader from "../common/Loader";
import { authAPI } from "../api/apis";
import { toast } from "react-toastify";

const navItems = [
  { to: "/", label: "Dashboard" },

  {
    label: "Works",
    children: [
      { to: "/homework", label: "Homework" },
      { to: "/assignment", label: "Assignment" },
      { to: "/model-paper", label: "Model Paper" },
      { to: "/notice", label: "Notice" },
    ],
  },

  {
    label: "Classes",
    children: [
      { to: "/attendance", label: "Attendance" },
      { to: "/studentsList", label: "Student List" },
      { to: "/timetable", label: "Time Table" },
      { to: "/online", label: "Online Class" },
      { to: "/message", label: "Message" },
    ],
  },
  {
    label: "Exams",
    children: [

      { to: "/exam-schedule", label: "Exam Schedule" },
      { to: "/results", label: "Result" },
      { to: "/result-list", label: "Result List" },
    ],

  },

  // 🔹 NEW HOSTEL MODULE
  {
    label: "Hostel",
    children: [
      { to: "/hostel-dashboard", label: "Hostel Dashboard" },
      { to: "/room-allocation", label: "Room Allocation" },
      { to: "/hostel-students", label: "Hostel Students" },
      { to: "/hostel-complaints", label: "Complaints" },
      { to: "/hostel-reports", label: "Hostel Reports" },
    ],
  },

  // 🔹 NEW PARAMPARA MODULE
  {
    label: "Parampara",
    children: [
      { to: "/parampara-events", label: "Events" },
      { to: "/parampara-attendance", label: "Attendance" },
      { to: "/parampara-achievements", label: "Achievements" },
      { to: "/parampara-gallery", label: "Gallery" },
      { to: "/faclity/parampara-events", label: "Events" },

    ],
  },
];



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setloading] = useState(false);
  const [TeacherProfiler, setTeacherProffiler] = useState({})
  const { userLogoutData, toststyle } = useAuth();



  const LogoutUser = useCallback(async () => {
    userLogoutData();
    toast.success("User Logout Successfully !!", toststyle);
    setloading(true);
    try {
      await authAPI.patch("/Logout");
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  }, [toststyle, userLogoutData]);

  const fetchUserProfile = useCallback(async () => {
    setloading(true);
    try {
      const { data } = await authAPI.get("/userProfile");
      console.log(data);
      setTeacherProffiler(data?.userData)
      console.log(TeacherProfiler)
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  }, []); // dependencies

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-8 h-20 max-w-[1600px] mx-auto">
        
        {/* Branding Node */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center text-xs font-black italic tracking-tighter shadow-lg shadow-gray-200">
             ITM
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-xs uppercase italic tracking-tighter text-gray-900">Faculty <span className="text-red-600">Portal</span></span>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-0.5 flex items-center gap-1.5">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
               Core Node Active
            </span>
          </div>
        </div>

        {/* Desktop Interface Nodes */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems?.map((item, index) => {
            if (item?.children) {
              return (
                <div key={index} className="relative group/nav">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${openDropdown === index ? 'text-red-600' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    {item?.label}
                    <div className={`w-1.5 h-1.5 rounded-full border border-current transition-transform duration-300 ${openDropdown === index ? 'rotate-180 bg-red-600' : ''}`}></div>
                  </button>

                  {openDropdown === index && (
                    <div className="absolute top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2 bg-white shadow-2xl shadow-gray-200 rounded-lg w-56 border border-gray-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-2 space-y-1">
                        {item?.children?.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              `block px-4 py-3 text-[9px] font-black uppercase tracking-widest italic rounded-lg transition-all ${isActive
                                ? "text-red-600 bg-red-50/50"
                                : "text-gray-400 hover:text-gray-900 hover:bg-white"
                              }`
                            }
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child?.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-[10px] font-black uppercase tracking-[0.2em] italic transition-all relative ${isActive
                    ? "text-red-600"
                    : "text-gray-400 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.4)]"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Utilities */}
        <div className="flex items-center gap-8">
          {/* Notifications Node */}
          <NavLink to="/notifications" className="relative group">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all border border-transparent group-hover:border-red-100">
               <span className="material-symbols-outlined text-2xl">notifications</span>
            </div>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-lg border-2 border-white shadow-sm">
              3
            </span>
          </NavLink>

          {/* Profiler Node */}
          {loading ? (
             <div className="w-10 h-10 animate-pulse bg-white rounded-lg"></div>
          ) : (
            <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] font-black uppercase text-gray-900 italic tracking-tighter leading-none">{TeacherProfiler?.name}</span>
                <span className="text-[8px] font-black uppercase text-red-600 tracking-widest mt-1 italic">{TeacherProfiler?.role}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center text-sm font-black italic shadow-lg shadow-gray-300">
                {TeacherProfiler?.name?.[0]}
              </div>
            </div>
          )}

          {/* Session Termination */}
          <button
            onClick={() => {
              userLogoutData();
              LogoutUser();
            }}
            className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all border border-transparent hover:border-red-700 shadow-sm active:scale-90"
            title="Terminate Session"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>

          {/* Mobile Terminal Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay Node */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-50 p-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
          {navItems?.map((item, index) => {
            if (item?.children) {
              return (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white text-[10px] font-black uppercase tracking-widest italic text-gray-900"
                  >
                    {item.label}
                    <span className="material-symbols-outlined text-sm">{openDropdown === index ? 'expand_less' : 'expand_more'}</span>
                  </button>

                  {openDropdown === index && (
                    <div className="grid grid-cols-1 gap-1 pl-4">
                      {item?.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className="block p-3 text-[9px] font-black uppercase tracking-widest italic text-gray-500 hover:text-red-600"
                          onClick={() => { setIsOpen(false); setOpenDropdown(null); }}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="block p-4 rounded-lg bg-white text-[10px] font-black uppercase tracking-widest italic text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}



