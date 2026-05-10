import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";
import NotificationBell from "../../Header/NotificationBell";
import { authAPI } from "../../api/apis";
import useAuth from "../../store/AdminStore";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);

  const navigate = useNavigate();
  const { userLogoutData, toststyle } = useAuth();

  const menuItems = [
    {
      title: "Fees",
      children: [
        { name: "Fees Dashboard", route: "/fees" },
        { name: "Fee Structure", route: "/fee-structure" },
        { name: "Fee Payments", route: "/fee-payments" },
      ],
    },
    {
      title: "Academic",
      children: [
        { name: "Students", route: "/students" },
        { name: "Faculty", route: "/faculty" },
        { name: "Courses", route: "/courses" },
        { name: "Subjects", route: "/subjects" },
        { name: "Classes", route: "/classes" },
        { name: "Sections", route: "/sections" },
      ],
    },
    {
      title: "Attendance",
      children: [
        { name: "Mark Attendance", route: "/attendance" },
        { name: "Attendance Report", route: "/attendance-report" },
      ],
    },
    {
      title: "Exams",
      children: [
        { name: "Exams", route: "/exams" },
        { name: "Exam Schedule", route: "/exam-schedule" },
        { name: "Results", route: "/results" },
      ],
    },
    {
      title: "Hostel",
      children: [
        { name: "Hostel Dashboard", route: "/hostel" },
        { name: "Room Allocation", route: "/hostel/rooms" },
        { name: "Hostel Students", route: "/hostel/students" },
        { name: "Hostel Fees", route: "/hostel/fees" },
        { name: "Hostel Complaints", route: "/hostel/complaints" },
      ],
    },
    {
      title: "Administration",
      children: [
        { name: "Roles", route: "/admin/roles" },
        { name: "Permissions", route: "/admin/permissions" },
        { name: "Notices", route: "/admin/notices" },
      ],
    },
  ];

  const toggleDropdown = (title) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  // 🔥 Fetch Profile
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await authAPI.get(
        "/login",
        { withCredentials: true }
      );

      setUserProfileData(data?.data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 🔥 Logout
  console.log(userProfileData)
  const handleLogout = async () => {

    userLogoutData();
    toast.success("Successfully Logout", toststyle);
    try {
      await authAPI.patch(
        "/logout",
        {},
        { withCredentials: true }
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Logout Failed",
        toststyle
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-gray-200 border-b w-full">
        <div className="max-w-7xl mx-auto px-4 min-h-[70px] flex items-center justify-between gap-5">

          {/* Brand */}
          <h1 className="shrink-0 text-red-800 font-extrabold font-serif text-lg">
            ITM College (Admin)
          </h1>

          {/* Desktop Navbar */}
          <nav className="hidden lg:flex items-center gap-4 font-extrabold font-serif text-sm whitespace-nowrap">
            <NavLink to="/" className="text-blue-800">
              Dashboard
            </NavLink>

            {menuItems.map((menu) => (
              <div key={menu.title} className="relative">
                <button
                  onClick={() => toggleDropdown(menu.title)}
                  className="flex items-center gap-1 text-blue-800">
                  {menu.title}
                  <span
                    className={`transition-transform ${openDropdown === menu.title ? "rotate-180" : ""
                      }`}>
                    ▼
                  </span>
                </button>

                {openDropdown === menu.title && (
                  <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded z-50">
                    {menu.children.map((item) => (
                      <NavLink
                        key={item.route}
                        to={item.route}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 hover:bg-rose-100 text-blue-800">
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <NavLink to="/admin/reports" className="text-blue-800">
              Reports
            </NavLink>

            <NavLink to="/admin/settings" className="text-blue-800">
              Settings
            </NavLink>
          </nav>

          {/* Right Section Desktop */}
          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <NotificationBell />

            {/* User Name */}
            <div className="font-semibold text-blue-900 flex flex-col justify-center items-center">
              <div> {userProfileData?.name || "Admin"}</div>
              <div> {userProfileData?.mobNumber || "Number"}</div>

            </div>

            {/* Logout Icon */}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-xl"
              title="Logout">
              <FiLogOut />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-2xl text-blue-800 shrink-0"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setOpenDropdown(null);
            }}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-4 space-y-3">
            <NavLink to="/" className="block font-semibold">
              Dashboard
            </NavLink>

            {menuItems.map((menu) => (
              <div key={menu.title}>
                <button
                  onClick={() => toggleDropdown(menu.title)}
                  className="w-full flex justify-between font-semibold">
                  {menu.title}
                  <span>{openDropdown === menu.title ? "▲" : "▼"}</span>
                </button>

                {openDropdown === menu.title && (
                  <div className="ml-4 mt-2 space-y-1">
                    {menu.children.map((item) => (
                      <NavLink
                        key={item.route}
                        to={item.route}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                        className="block text-sm text-gray-700">
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <NavLink to="/admin/reports" className="block font-semibold">
              Reports
            </NavLink>

            <NavLink to="/admin/settings" className="block font-semibold">
              Settings
            </NavLink>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="block font-semibold text-red-600">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
