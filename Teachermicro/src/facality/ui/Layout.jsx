import React from "react";
import { Outlet } from "react-router-dom";
import TopNavbar from "../header/TopNavbar";
import useAuth from "../../store/FacultyStore";
import Login from "../common/Login";

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
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-10 bg-pink-50">
        <div className="w-full">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;



