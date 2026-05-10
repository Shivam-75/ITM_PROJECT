import { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { authAPI } from "../../api/apis";
import { toast } from "react-toastify";
import Loader from "../common/Loader";

const Login = () => {
  const { setloginregistration, UserLogsData, toaststyle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    moNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.moNumber || !formData.password) {
      toast.error("Contact aur Password dono bharna zaroori hai", toaststyle);
      return;
    }

    try {
      setLoading(true);
      const { data } = await authAPI.post("/login", formData, { withCredentials: true });
      toast.success(data?.message || "Login Success", toaststyle);
      UserLogsData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed", toaststyle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      {/* LEFT: FORM SECTION */}
      <div className="w-full lg:w-[48%] flex flex-col p-10 md:p-20 justify-center">
        <div className="max-w-md w-full mx-auto space-y-10">

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Access Portal</p>
            <h1 className="text-6xl font-black tracking-tight text-gray-900">ITM</h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">Secure academic management for India's finest management archives.</p>
          </div>

          <div className="flex items-center border-b border-gray-100">
            <button className="px-6 py-4 text-sm font-black uppercase tracking-widest border-b-2 border-blue-600 text-blue-600 transition-all duration-300">Sign In</button>
            <button onClick={() => setloginregistration(true)} className="px-6 py-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all duration-300">Create Account</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Number</label>
              <input
                type="tel" name="moNumber" placeholder="0000000000"
                value={formData.moNumber} onChange={handleChange} required maxLength={10}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-sm font-bold font-mono"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Security Key</label>
                <label className="text-[10px] font-bold uppercase tracking-tighter text-blue-600 hover:underline cursor-pointer">Forgot Password?</label>
              </div>
              <input
                type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 text-sm font-bold"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-xl shadow-blue-500/20 active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="pt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest text-gray-300"><span className="bg-white px-4">Support Contact</span></div>
            </div>
            <p className="mt-6 text-center text-[10px] font-bold text-gray-400">Official ITM College of Management Enrollment v2.0</p>
          </div>
        </div>
      </div>

      {/* RIGHT: IMAGE SECTION */}
      <div className="hidden lg:flex w-[52%] relative">
        <img
          src="./image.png"
          alt="ITM Architecture"
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-[80%]"
        />
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>

        <div className="absolute bottom-16 left-16 right-16 p-12 bg-white/90 backdrop-blur-md rounded-lg shadow-2xl space-y-6">
          <div className="text-3xl text-blue-600 font-bold">🏫</div>
          <p className="text-2xl font-black text-gray-900 leading-tight">
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">— Nelson Mandela</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
