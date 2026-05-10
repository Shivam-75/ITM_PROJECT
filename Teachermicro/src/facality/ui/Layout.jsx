import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../header/Sidebar";
import TopNavbar from "../header/TopNavbar";
import useAuth from "../../store/FacultyStore";
import Login from "../common/Login";
import { FiX } from "react-icons/fi";

const Layout = () => {
  const { userLogin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!userLogin) {
    return <Login />;
  }

  return (
    <div className="flex h-[100dvh] bg-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-72 h-[100dvh] sticky top-0 shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-[85%] sm:w-80 shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-10 bg-white">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
