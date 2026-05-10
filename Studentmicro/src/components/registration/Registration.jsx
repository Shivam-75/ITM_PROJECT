import React, { useState, useCallback } from "react";
import Loader from "../common/Loader";
import { useAuth } from "../../store/AuthStore";
import { authAPI } from "../../api/apis";
import { toast } from "react-toastify";
import { useAcademicRegistry } from "../../hooks/useAcademicRegistry";

function Registration() {
  const [loading, setLoading] = useState(false);
  const { setloginregistration, toaststyle } = useAuth();
  const { courses, years, semesters, sections, loading: registryLoading } = useAcademicRegistry();

  const [formData, setFormData] = useState({
    name: "", password: "", year: "", course: "", section: "", moNumber: "", gender: "", semester: ""
  });

  const GENDERS = ["male", "female", "other"];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        moNumber: Number(formData.moNumber),
        semester: formData.semester // Removed Number() casting
      };
      const { data } = await authAPI.post("/registration", payload, { withCredentials: true });
      setFormData({ name: "", password: "", year: "", course: "", section: "", moNumber: "", gender: "", semester: "" });
      setloginregistration(false);
      toast.success(data?.message, toaststyle);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, toaststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white font-sans overflow-hidden flex">
      {(loading || registryLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      {/* LEFT: FORM SECTION */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-between p-8 md:p-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-6 lg:space-y-8 my-auto py-10">
          
          <div className="space-y-2">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Access Portal</p>
             <h1 className="text-5xl font-black tracking-tight text-gray-900">ITM</h1>
             <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm font-bold uppercase tracking-widest">Enrollment System v2.0</p>
          </div>

          <div className="flex items-center border-b border-gray-100 mb-2">
             <button onClick={() => setloginregistration(false)} className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all">Sign In</button>
             <button className="px-5 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-600 text-blue-600 transition-all">Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
               <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Student Full Name</label>
               <input
                 type="text" name="name" placeholder="John Doe"
                 value={formData.name} onChange={handleChange} required
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-xs font-bold"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile</label>
                   <input
                     type="tel" name="moNumber" placeholder="0000000000"
                     value={formData.moNumber} onChange={handleChange} required maxLength={10}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-xs font-bold font-mono"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
                   <input
                     type="password" name="password" placeholder="••••••••"
                     value={formData.password} onChange={handleChange} required
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-xs font-bold"
                   />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Course</label>
                    <select
                      name="course" value={formData.course} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Course</option>
                      {courses.map(c => <option key={c.id} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Academic Year</label>
                    <select
                      name="year" value={formData.year} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Year</option>
                      {years.map(y => <option key={y.id} value={y.name}>{y.name.toUpperCase()}</option>)}
                    </select>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Semester</label>
                    <select
                      name="semester" value={formData.semester} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Semester</option>
                      {semesters.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Section</label>
                    <select
                      name="section" value={formData.section} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Section</option>
                      {sections.map(sec => <option key={sec.id} value={sec.name}>{sec.name.toUpperCase()}</option>)}
                    </select>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Gender</label>
                    <select
                      name="gender" value={formData.gender} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-[10px] font-black uppercase appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                    </select>
                 </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] mt-4"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        <footer className="text-center py-4">
             <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic leading-relaxed">Official ITM Student Access System v2.0</p>
        </footer>
      </div>

      {/* RIGHT: IMAGE SECTION */}
      <div className="hidden lg:flex w-[55%] relative h-full">
         <img 
            src="./itm_architecture_promo_1776539198286.png" 
            alt="ITM Architecture" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-[70%]"
         />
         <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply"></div>
         
         <div className="absolute bottom-12 left-12 right-12 p-10 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl space-y-4">
            <div className="text-2xl text-blue-600 font-bold">🏫</div>
            <p className="text-xl font-black text-gray-900 leading-tight italic">
               "Empowering the next generation of academic leaders."
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400">— ITM Management</p>
         </div>
      </div>
    </div>
  );
}

export default Registration;
