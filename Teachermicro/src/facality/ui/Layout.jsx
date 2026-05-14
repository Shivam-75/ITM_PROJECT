import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../header/TopNavbar";
import useAuth from "../../store/FacultyStore";
import Login from "../common/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const { userLogin } = useAuth();

  if (!userLogin) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-pink-50 overflow-hidden">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50">
        <TopNavbar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-pink-50">
        <div className="w-full">
           <Outlet />
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Layout;



