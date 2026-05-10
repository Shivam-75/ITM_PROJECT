import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Logins from "../signup/Logins";
import useAuth from "../store/AdminStore";
import Sidebar from "../components/navbar/Sidebar";
import TopNavbar from "../components/navbar/TopNavbar";

const Layout = () => {
  const { userLogin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!userLogin) {
    return <Logins />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-display">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-72 h-screen border-r border-gray-100 flex-shrink-0 print:hidden">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden print:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:overflow-visible">
        <div className="print:hidden">
          <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#f5f5f7] print:bg-white print:p-0">
          <div className="max-w-[1600px] mx-auto print:max-w-none">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
