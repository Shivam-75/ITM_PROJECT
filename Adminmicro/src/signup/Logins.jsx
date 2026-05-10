import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../store/AdminStore";
import { authAPI } from "../api/apis";
import { FiPhone, FiLock, FiChevronRight, FiShield } from "react-icons/fi";

const Logins = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toststyle, UserLogsData } = useAuth();

  const [formData, setFormData] = useState({
    mobNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mobNumber || !formData.password) {
      toast.error("Please enter contact and password", toststyle);
      return;
    }

    try {
      setLoading(true);

      const { data } = await authAPI.post(
        "/login",
        formData,
        { withCredentials: true }
      );

      console.log(data);
      UserLogsData();
      toast.success(data?.message || "Welcome back, Admin!", toststyle);
      navigate("/");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Authentication failed",
        toststyle
      );
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-display">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-br from-black via-[#1a1a1a] to-red-900 z-0 shadow-2xl"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        {/* Logo/Brand Section */}
        <div className="mb-6 text-center text-white">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-600/20 backdrop-blur-md rounded-2xl mb-3 border border-red-500/30 shadow-xl shadow-red-900/20">
            <FiShield size={28} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ITM Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Authorized access only</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-[380px]">
          <div className="bg-[#111111] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
            <div className="p-6 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Sign In</h2>
                <div className="px-3 py-1 bg-red-950/30 text-red-500 text-[10px] font-bold rounded-full uppercase tracking-widest border border-red-500/20">
                  Secure Admin
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                    Contact Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <FiPhone size={16} />
                    </div>
                    <input
                      type="text"
                      name="mobNumber"
                      placeholder="Enter mobile number"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600/50 focus:border-red-600 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600"
                      value={formData.mobNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <FiLock size={16} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600/50 focus:border-red-600 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex items-center py-1">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-3.5 w-3.5 bg-black border-white/20 rounded text-red-600 focus:ring-offset-black focus:ring-red-600 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                    Stay signed in
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:transform-none mt-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-sm">Access Dashboard</span>
                      <FiChevronRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-medium">
            &copy; 2024 ITM GROUP • ENCRYPTED SESSION
          </p>
        </div>
      </div>
    </div>
  );
};

export default Logins;
