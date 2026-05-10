import React from "react";
import { Outlet } from "react-router-dom";
import Logins from "../signup/Logins";
import useAuth from "../store/AdminStore";
import TopNavbar from "../components/navbar/TopNavbar";

const Layout = () => {
  const { userLogin } = useAuth();

  if (!userLogin) {
    return <Logins />;
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-display">
      {/* Top Navbar */}
      <div className="print:hidden sticky top-0 z-50">
        <TopNavbar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-white print:bg-white print:p-0">
        <div className="w-full print:w-full">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;




