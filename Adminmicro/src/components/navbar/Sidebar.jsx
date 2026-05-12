import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FiGrid, 
  FiDollarSign, 
  FiBookOpen, 
  FiUserCheck, 
  FiClipboard, 
  FiHome, 
  FiSettings, 
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiLogOut,
  FiUserPlus
} from "react-icons/fi";
import { authAPI } from "../../api/apis";
import useAuth from "../../store/AdminStore";
import { toast } from "react-toastify";

const Sidebar = ({ isMobile, onClose }) => {
  const [openMenus, setOpenMenus] = useState({});
  const { userLogoutData, toststyle } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    userLogoutData();
    toast.success("Successfully Logout", toststyle);
    try {
      await authAPI.patch("/logout", {}, { withCredentials: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout Failed", toststyle);
    }
  };

  const toggleMenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menuItems = [
    { type: 'header', title: 'Course Work' },
    {
      title: "Dashboard",
      icon: <FiGrid size={20} />,
      route: "/",
    },
    { type: 'header', title: 'Management' },
    {
      title: "Academic",
      icon: <FiBookOpen size={20} />,
      children: [
        { name: "Students", route: "/students" },
        { name: "Faculty", route: "/faculty" },
        { name: "Subjects", route: "/subjects" },
      ],
    },
    {
      title: "Fees Management",
      icon: <FiDollarSign size={20} />,
      children: [
        { name: "Dashboard", route: "/fees" },
        { name: "Structure", route: "/fee-structure" },
        { name: "Fee Submission", route: "/fee-payments" },
      ],
    },
    {
      title: "Attendance Report",
      icon: <FiUserCheck size={20} />,
      route: "/attendance-report",
    },
    { type: 'header', title: 'Facilities' },
    {
      title: "Exams & Results",
      icon: <FiClipboard size={20} />,
      children: [
        { name: "Exams", route: "/exams" },
        { name: "Schedule", route: "/exam-schedule" },
        { name: "Sessional Results", route: "/sessional-results" },
        { name: "Documents", route: "/academic-docs" },
      ],
    },
    {
      title: "Hostel",
      icon: <FiHome size={20} />,
      children: [
        { name: "Dashboard", route: "/hostel" },
        { name: "Rooms", route: "/hostel/rooms" },
        { name: "Students", route: "/hostel/students" },
        { name: "Complaints", route: "/hostel/complaints" },
      ],
    },
    { type: 'header', title: 'Administration' },
    {
      title: "Enrollment Control",
      icon: <FiUserPlus size={20} />,
      children: [
        { name: "Administrator Reg.", route: "/admin-registration" },
        { name: "Teacher Reg.", route: "/teacher-registration" },
      ],
    },
    {
      title: "Reports",
      icon: <FiFileText size={20} />,
      route: "/admin/reports",
    },
    {
      title: "Settings",
      icon: <FiSettings size={20} />,
      children: [
        { name: "Course", route: "/admin/settings/courses" },
        { name: "Section", route: "/sections" },
        { name: "Semester", route: "/semesters" },
        { name: "Year", route: "/years" },
      ],
    },
  ];

  // Auto-open menus based on current route
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    menuItems.forEach(menu => {
      if (menu.children) {
        const hasActiveChild = menu.children.some(child => location.pathname === child.route);
        if (hasActiveChild) {
          newOpenMenus[menu.title] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  return (
    <div className={`h-full bg-white text-gray-700 flex flex-col border-r border-slate-100`}>
      {/* Sidebar Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-md shadow-red-600/20">
            ITM
          </div>
          <span className="text-gray-900 font-bold tracking-tight uppercase italic text-sm">Admin Portal</span>
        </div>

        {/* Mobile Close Button */}
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
          >
            <FiX size={24} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1.5">
        {menuItems.map((menu, index) => {
          if (menu.type === 'header') {
            return (
              <div key={`header-${index}`} className="px-3 pt-6 pb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase italic tracking-[0.15em] opacity-70">
                  {menu.title}
                </span>
              </div>
            );
          }

          const isParentOfActive = menu.children?.some(child => location.pathname === child.route);

          return (
            <div key={menu.title} className="space-y-1">
              {menu.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(menu.title)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
                      isParentOfActive 
                        ? 'text-red-600 bg-red-50/30' 
                        : openMenus[menu.title] 
                          ? 'bg-white text-gray-900' 
                          : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isParentOfActive ? 'text-red-600' : openMenus[menu.title] ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>
                        {menu.icon}
                      </span>
                      <span className={`text-[12px] font-bold tracking-wide uppercase ${isParentOfActive ? 'text-red-600' : 'text-slate-800'}`}>
                        {menu.title}
                      </span>
                    </div>
                    {openMenus[menu.title] ? 
                      <FiChevronDown size={14} className={isParentOfActive ? 'text-red-600/70' : 'text-gray-400'} /> : 
                      <FiChevronRight size={14} className={isParentOfActive ? 'text-red-600/70' : 'text-gray-400'} />
                    }
                  </button>
                  {openMenus[menu.title] && (
                    <div className="ml-9 space-y-1 py-1">
                      {menu.children.map((child) => {
                        const isChildActive = location.pathname === child.route;
                        return (
                          <NavLink
                            key={child.route}
                            to={child.route}
                            onClick={isMobile ? onClose : undefined}
                            className={`block py-2 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                              isChildActive 
                                ? 'text-red-500 bg-red-50/50' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                            }`}
                          >
                            {child.name}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={menu.route}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-all group ${
                      isActive 
                        ? 'text-red-600 bg-red-50/30' 
                        : 'hover:bg-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'} transition-colors`}>{menu.icon}</span>
                      <span className={`text-[12px] font-bold tracking-wide uppercase ${isActive ? 'text-red-600' : 'text-slate-800'}`}>{menu.title}</span>
                    </>
                  )}
                </NavLink>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer / User Session Info */}
      <div className="p-4 border-t border-slate-100 bg-white/50 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-lg transition-all bg-white border border-slate-100 shadow-sm hover:shadow-md text-red-500 font-bold uppercase tracking-[0.2em] text-[11px] italic"
        >
          <FiLogOut size={16} />
          <span>Logout Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;




