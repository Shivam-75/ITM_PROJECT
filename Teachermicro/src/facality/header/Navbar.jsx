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
    <header className="sticky top-0 w-full font-serif bg-gray-200 shadow-md z-50 border-b border-gray-400">

      <div className="flex items-center justify-between px-8 h-16">

        {/* College Title */}
        <h1 className="text-red-700 hidden  sm:flex font-bold text-xl tracking-wide">
          Faculty
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems?.map((item, index) => {
            if (item?.children) {
              return (
                <div key={index} className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === index ? null : index)
                    }
                    className="text-blue-800 font-semibold text-[13px] hover:text-blue-600 transition"
                  >
                    {item?.label} ▼
                  </button>

                  {openDropdown === index && (
                    <div className="absolute top-10 left-0 bg-white shadow-xl rounded-md w-52">
                      {item?.children?.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${isActive
                              ? "bg-blue-700 text-white rounded-xl"
                              : "text-gray-700 hover:text-white hover:bg-blue-700 rounded-xl"
                            }`
                          }
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child?.label}
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
                className={({ isActive }) =>
                  `font-semibold text-[13px] ${isActive
                    ? "text-blue-600"
                    : "text-blue-800 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">



          {/* Notification */}
          <NavLink to="/notifications" className="relative">
            <span className="material-symbols-outlined text-yellow-600 text-3xl">
              notifications
            </span>
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
              3
            </span>
          </NavLink>

          {loading ? <div className="mx-5"> <Loader /></div> : <div className=" md:block text-right">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-bold capitalize text-blue-900">
                  {TeacherProfiler?.course}
                </p>
                <p className="text-sm font-bold capitalize text-blue-900">
                  {TeacherProfiler?.role}
                </p>
              </div>
              <p className="bg-rose-700 rounded-full h-10 w-10 flex justify-center items-center text-white font-bold text-lg capitalize">
                {TeacherProfiler?.name?.[0]}
              </p>
            </div>

          </div>
          }

          <button
            onClick={() => {
              userLogoutData();
              LogoutUser()
            }}
            className="text-red-600 hover:text-red-800 transition"
          >
            <span className="material-symbols-outlined text-2xl">
              logout
            </span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
          >
            <span className="material-symbols-outlined text-blue-800">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-6 pb-4 space-y-2">
          {navItems?.map((item, index) => {
            if (item?.children) {
              return (
                <div key={index}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === index ? null : index)
                    }
                    className="w-full text-left py-2 font-semibold text-blue-800"
                  >
                    {item.label}
                  </button>

                  {openDropdown === index && (
                    <div className="pl-4 space-y-1">
                      {item?.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className="block py-1 text-sm text-gray-700"
                          onClick={() => {
                            setIsOpen(false);
                            setOpenDropdown(null);
                          }}
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
                className="block py-2 font-semibold text-blue-800"
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
