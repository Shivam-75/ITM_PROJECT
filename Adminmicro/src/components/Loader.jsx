import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/40 backdrop-blur-[4px] animate-in fade-in duration-300">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-600 animate-spin"></div>
        
        {/* Inner Pulse */}
        <div className="absolute inset-0 m-auto w-8 h-8 bg-red-600/10 rounded-full animate-pulse"></div>
        
        {/* Logo or Text (Optional) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse">
            Processing...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;




