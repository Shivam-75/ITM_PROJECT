import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../components/registration/Login";
import Registration from "../components/registration/Registration";
import TopNavbar from "../components/headers/TopNavbar";
import { useAuth } from "../store/AuthStore";

const Layout = () => {
    const { loginRegistration, userLogin } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            {loginRegistration ? (
                <Registration />
            ) : userLogin ? (
                <div className="flex flex-col min-h-screen relative overflow-hidden">
                    {/* Top Navbar */}
                    <div className="sticky top-0 z-50 bg-white">
                        <TopNavbar />
                    </div>

                    <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                        {/* Main Content Area */}
                        <main className="flex-1 pt-6 pb-10 px-4 sm:px-6 lg:px-8 bg-white">
                            <div className="w-full">
                                <Outlet />
                            </div>
                        </main>

                        <footer className="py-6 text-center text-[10px] text-gray-300 uppercase tracking-[0.3em] border-t border-gray-50 bg-white">
                            ITM College • System v2.0
                        </footer>
                    </div>

                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default Layout;



