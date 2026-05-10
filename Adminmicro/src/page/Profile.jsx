import React, { useState, useEffect, useCallback } from "react";
import { FiUser, FiMail, FiPhone, FiShield, FiBriefcase, FiCalendar, FiEdit3 } from "react-icons/fi";
import { authAPI } from "../api/apis";
import Loader from "../components/Loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await authAPI.get("/login", { withCredentials: true });
      setProfile(data?.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden w-[98%] mx-auto md:w-full">
        <div className="h-32 bg-gradient-to-r from-[#111111] to-red-900 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="w-24 h-24 bg-white rounded-3xl p-1.5 shadow-xl">
               <div className="w-full h-full bg-[#111111] rounded-2xl flex items-center justify-center text-white text-3xl font-black italic border-4 border-gray-50">
                  {profile?.name?.[0] || "A"}
               </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tight">
              {profile?.name || "Administrator"}
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
              <FiShield className="text-red-600" />
              Master Administrative Access
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95">
            <FiEdit3 />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6 md:col-span-2 w-[98%] mx-auto md:w-full">
          <h2 className="text-sm font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center italic font-black text-sm">C</div>
            Account Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Legal Name</p>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-800 italic uppercase">
                <FiUser className="text-red-500" />
                {profile?.name || "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Number</p>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-800 italic uppercase">
                <FiPhone className="text-red-500" />
                {profile?.mobNumber || "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrative Role</p>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-800 italic uppercase">
                <FiBriefcase className="text-red-500" />
                System SuperAdmin
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Email</p>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-800 italic uppercase">
                <FiMail className="text-red-500" />
                admin@itmcollege.ac.in
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#111111] rounded-[2rem] p-8 shadow-xl text-white space-y-6 w-[98%] mx-auto md:w-full">
          <h2 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-3 italic">
            <FiShield size={18} />
            Security Status
          </h2>
          
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Last Login</p>
              <div className="flex items-center gap-2 text-xs font-bold italic">
                <FiCalendar className="text-red-500" />
                Today, 10:45 PM
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Session Health</p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 italic">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Fully Optimized
              </div>
            </div>

            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all italic">
              View Security Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
