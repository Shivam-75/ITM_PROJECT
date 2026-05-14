import React from "react";
import { Outlet } from "react-router-dom";
import Logins from "../signup/Logins";
import useAuth from "../store/AdminStore";
import TopNavbar from "../components/navbar/TopNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const { userLogin } = useAuth();

  if (!userLogin) {
    return <Logins />;
  }

  return (
    <div className="flex flex-col h-screen bg-pink-50 overflow-hidden font-display">
      {/* Top Navbar */}
      <div className="print:hidden sticky top-0 z-50">
        <TopNavbar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-pink-50 print:bg-white print:p-0">
        <div className="w-full print:w-full">
           <Outlet />
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default Layout;




