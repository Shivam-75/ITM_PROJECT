import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../store/FacultyStore";
import BigLoader from "./BigLoader";
import { toast } from "react-toastify";
import { authAPI } from "../api/apis";

function Login() {
  const { toststyle, UserLogsData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    moNumber: "",
    password: "",
  });

  //Todo ------------login apies

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.moNumber || !loginData.password) {
      toast.error("Fill Contact Number And password !!", toststyle);
      return;
    }

    try {
      setLoading(true);

      const { data } = await authAPI.post(
        "/login",
        loginData,
        { withCredentials: true }
      );

      toast.success(data?.message || "Login Success", toststyle);
      UserLogsData();

      console.log(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed",
        toststyle
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= HEADER ================= */}
      {loading && (
        <div className="absolute top-[50%] left-[45%]">
          <BigLoader />
        </div>
      )}
      <main className="flex-grow flex items-center justify-center px-3 sm:px-6 py-6 md:py-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border">
          {/* LEFT INFO */}
          <div className="hidden lg:flex lg:col-span-5 flex-col bg-slate-50 p-8 xl:p-10 justify-between relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(#1111d4 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative">
              <h1 className="text-2xl xl:text-3xl font-black mb-4">
                Welcome back to ITM College.
              </h1>
              <p className="text-[#4c4c9a] text-base xl:text-lg">
                Login to access your dashboard, courses, faculty tools, and
                academic resources.
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-7 px-4 py-6 sm:p-8 md:p-10 xl:p-12">
            <div className="max-w-[420px] mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Teacher Login</h2>
              <p className="text-[#4c4c9a] text-sm sm:text-base mb-6 sm:mb-8">
                Enter your contact number to continue.
              </p>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {/* CONTACT NUMBER */}
                <input
                  type="tel"
                  name="moNumber"
                  placeholder="Enter Contact Number"
                  className="input-style"
                  value={loginData.moNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />

                {/* PASSWORD */}
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input-style"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />

                {/* EXTRA LINKS */}
                <div className="flex justify-between items-center text-sm">
                  <NavLink
                    to="/forgot-password"
                    className="text-primary hover:underline">
                    Forgot password?
                  </NavLink>
                </div>

                {/* SUBMIT */}
                <button className="w-full bg-primary text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-blue-700 transition">
                  Login →
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
