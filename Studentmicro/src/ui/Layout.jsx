import React from "react";
import { Outlet } from "react-router-dom";
import Login from "../components/registration/Login";
import Registration from "../components/registration/Registration";
import TopNavbar from "../components/headers/TopNavbar";
import { useAuth } from "../store/AuthStore";

const Layout = () => {
    const { loginRegistration, userLogin } = useAuth();

    return (
        <div className="min-h-screen bg-pink-50">
            {loginRegistration ? (
                <Registration />
            ) : userLogin ? (
                <div className="flex flex-col min-h-screen relative overflow-hidden">
                    {/* Top Navbar */}
                    <div className="fixed top-0 left-0 right-0 z-50 bg-white navbar-element border-b border-slate-100">
                        <TopNavbar />
                    </div>

                    <div className="flex-1 flex flex-col min-h-screen pt-40">
                        {/* Main Content Area */}
                        <main className="flex-1 pb-10 px-4 sm:px-6 lg:px-8 bg-pink-50">
                            <div className="w-full">
                                <Outlet />
                            </div>
                        </main>

                        <footer className="py-6 text-center text-[10px] text-gray-300 uppercase tracking-[0.3em] border-t border-rose-100 bg-pink-50">
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
