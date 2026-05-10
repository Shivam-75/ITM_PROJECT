import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { FiChevronDown, FiUser, FiBell } from "react-icons/fi";

const TopNavbar = () => {
    const { student } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300">
            <div className="h-full px-6 flex items-center justify-between">
                
                <div className="hidden sm:block">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                        Status: <span className="text-black font-bold">Authenticated</span>
                    </h2>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                    
                    <button className="p-2 text-gray-400 hover:text-black transition relative">
                        <FiBell size={20} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 rounded-full transition active:scale-95"
                        >
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold shadow-xl">
                                {student?.name?.[0] || <FiUser />}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-black uppercase tracking-tighter leading-none">{student?.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{student?.course}</p>
                            </div>
                            <FiChevronDown className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isProfileOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsProfileOpen(false)}
                                ></div>
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-6 text-center border-b border-gray-100 mb-2">
                                        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl border-4 border-gray-50 uppercase">
                                            {student?.name ? student.name.charAt(0) : <FiUser />}
                                        </div>
                                        <h3 className="font-bold text-black text-sm uppercase tracking-tight">{student?.name || "Student User"}</h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">{student?.course || "No Course"}</p>
                                    </div>
                                    
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-gray-400 uppercase tracking-widest">Section</span>
                                            <span className="text-black bg-gray-50 px-2 py-1 rounded">{student?.section || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-gray-400 uppercase tracking-widest">Year</span>
                                            <span className="text-black bg-gray-50 px-2 py-1 rounded">{student?.year ? `${student.year} Year` : "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-gray-400 uppercase tracking-widest">Contact</span>
                                            <span className="text-black">{student?.moNumber || "N/A"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="px-4 py-3 text-[9px] text-gray-300 text-center uppercase tracking-[0.3em] font-black border-t border-gray-50 bg-gray-50/50 rounded-b-lg">
                                        Official Student Profile
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
