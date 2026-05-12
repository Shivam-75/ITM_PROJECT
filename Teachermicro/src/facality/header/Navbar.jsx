import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import { 
  FiGrid, FiBook, FiEdit3, FiUsers, 
  FiBell, FiUser, FiLogOut, FiChevronDown, 
  FiHome, FiAward, FiActivity
} from "react-icons/fi";
import useAuth from "../../store/FacultyStore";
import { authAPI } from "../api/apis";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Academic",
    icon: <FiGrid />,
    children: [
      { to: "/", label: "Dashboard" },
      { to: "/attendance", label: "Attendance" },
      { to: "/studentsList", label: "Student List" },
      { to: "/timetable", label: "Time Table" },
    ],
  },
  {
    label: "Coursework",
    icon: <FiBook />,
    children: [
      { to: "/homework", label: "Homework" },
      { to: "/assignment", label: "Assignment" },
      { to: "/model-paper", label: "Model Paper" },
      { to: "/notice", label: "Notice" },
    ],
  },
  {
    label: "Exams",
    icon: <FiEdit3 />,
    children: [
      { to: "/exam-schedule", label: "Exam Schedule" },
      { to: "/results", label: "Result" },
      { to: "/result-list", label: "Result List" },
    ],
  },
  {
    label: "Management",
    icon: <FiUsers />,
    children: [
      { to: "/hostel-dashboard", label: "Hostel" },
      { to: "/parampara-events", label: "Parampara" },
      { to: "/online", label: "Online Class" },
      { to: "/message", label: "Message" },
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [TeacherProfiler, setTeacherProffiler] = useState({});
  const { userLogoutData, toststyle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const LogoutUser = useCallback(async () => {
    try {
      await authAPI.patch("/Logout");
    } catch (err) {
      console.log(err);
    } finally {
      userLogoutData();
      toast.success("User Logout Successfully !!", toststyle);
      navigate("/");
    }
  }, [toststyle, userLogoutData, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await authAPI.get("/userProfile");
        setTeacherProffiler(data?.userData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <header className="h-[90px] bg-white border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Section */}
      <div className="flex items-center gap-5">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-[#111111] rounded-[10px] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all">
            <span className="text-xl font-black italic">F</span>
          </div>
          <div className="hidden lg:block text-left">
            <h1 className="text-[#111111] font-black tracking-tight uppercase italic text-2xl leading-none">FACULTY</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Digital Portal</p>
          </div>
        </div>
      </div>

      {/* Center Navigation */}
      <nav className="hidden xl:flex items-center gap-10" ref={navRef}>
        {navItems.map((item, index) => {
          const isActive = item.children?.some(c => location.pathname === c.to);
          
          return (
            <div key={index} className="relative group">
              <button
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                className={`flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.15em] italic transition-all duration-300 ${
                  isActive || openDropdown === index 
                    ? "text-blue-600" 
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                <FiChevronDown className={`transition-transform duration-300 ${openDropdown === index ? "rotate-180" : ""}`} />
              </button>

              {openDropdown === index && (
                <div className="absolute top-[50px] left-1/2 -translate-x-1/2 w-60 bg-white rounded-[10px] shadow-2xl border border-slate-50 p-2 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => setOpenDropdown(null)}
                      className={({ isActive }) =>
                        `block px-5 py-3.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest italic transition-all ${
                          isActive ? 'bg-white border border-slate-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-white border border-slate-100 hover:translate-x-1'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-10">
        {/* Notifications */}
        <div className="relative cursor-pointer group">
          <div className="p-3 bg-white text-slate-400 group-hover:text-blue-600 transition-all border border-slate-100 group-hover:border-blue-50 rounded-[10px]">
            <FiBell size={24} />
          </div>
          <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-6 pl-10 border-l border-slate-100">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[11px] font-black uppercase text-[#111111] italic tracking-tight">{TeacherProfiler?.name || "FACULTY MEMBER"}</span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1 italic">
              {TeacherProfiler?.role || "DEPARTMENT HEAD"}
            </span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-14 h-14 bg-[#111111] text-white rounded-[10px] flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                profileOpen ? "ring-4 ring-blue-50" : ""
              }`}
            >
              <FiUser size={28} />
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-slate-50 p-4 animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">
                <div className="p-4 mb-3 bg-white border border-slate-100 rounded-[10px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Node</p>
                  <h3 className="text-xs font-black text-slate-900 uppercase italic truncate">
                    {TeacherProfiler?.name || "Faculty"}
                  </h3>
                </div>
                <button
                  onClick={LogoutUser}
                  className="w-full flex items-center justify-between p-4 rounded-[10px] text-rose-500 hover:bg-rose-50 transition-all font-black uppercase tracking-widest text-[10px] italic group"
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
}
