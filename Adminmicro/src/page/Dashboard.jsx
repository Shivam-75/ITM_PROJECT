import React, { useState, useEffect, useMemo } from "react";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiArrowUpRight, 
  FiArrowDownRight, 
  FiActivity, 
  FiBookOpen, 
  FiCalendar, 
  FiClock,
  FiZap,
  FiShield,
  FiDollarSign,
  FiMoreHorizontal,
  FiRefreshCcw
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

// 🔹 Backend URLs (From Environment)
const AUTH_BASE_URL = import.meta.env.VITE_BASE_Auth;
const REPORT_BASE_URL = import.meta.env.VITE_BASE_REPORT.replace('/Admin', '/Profile');

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        activeSchedules: 12,
        collection: "₹4.5L",
        attendance: "94%",
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Student Count from Report Service
            const studentRes = await axios.get(`${REPORT_BASE_URL}/student-list`, { withCredentials: true });
            const sCount = studentRes.data.studentList?.length || 0;

            // 2. Fetch Teacher Count from Auth Service
            const teacherRes = await axios.get(`${AUTH_BASE_URL}/TeacherList`, { withCredentials: true });
            const tCount = teacherRes.data.Teacherdata?.length || 0;

            setStats(prev => ({
                ...prev,
                totalStudents: sCount,
                totalTeachers: tCount
            }));
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
            // toast.error("Live metrics sync failed.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const kpiCards = [
        { 
            label: "Total Students", 
            value: stats.totalStudents, 
            icon: FiUsers, 
            color: "blue", 
            trend: "+12%", 
            up: true 
        },
        { 
            label: "Academic Faculty", 
            value: stats.totalTeachers, 
            icon: FiZap, 
            color: "red", 
            trend: "+05%", 
            up: true 
        },
        { 
            label: "Daily Attendance", 
            value: stats.attendance, 
            icon: FiCheckCircle, 
            color: "emerald", 
            trend: "+2%", 
            up: true 
        },
        { 
            label: "Term Collection", 
            value: stats.collection, 
            icon: FiDollarSign, 
            color: "amber", 
            trend: "-1.5%", 
            up: false 
        },
    ];

    const formatValue = (val) => {
        return loading ? "..." : val;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {loading && <Loader />}
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Control <span className="text-red-600">Center</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] italic">
                            Live Node Sync: Active • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchData}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm active:scale-95"
                    >
                        <FiRefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="flex items-center gap-3 px-6 py-3 bg-[#111111] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] italic hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95">
                        <FiShield size={16} />
                        Admin Registry
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        className="group relative bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden w-[98%] mx-auto sm:w-full"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform duration-700 group-hover:scale-150 bg-${card.color}-600`}></div>
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 rounded-2xl bg-${card.color}-50 text-${card.color}-600`}>
                                <card.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black italic px-2.5 py-1 rounded-full ${card.up ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                                {card.up ? <FiArrowUpRight size={10} /> : <FiArrowDownRight size={10} />}
                                {card.trend}
                            </div>
                        </div>

                        <div className="mt-6 relative z-10">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">{card.label}</h3>
                            <p className="text-3xl font-black text-gray-900 mt-1.5 tracking-tighter">
                                {formatValue(card.value)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Academic Distribution */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group w-[98%] mx-auto lg:w-full">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-black text-gray-900 uppercase italic tracking-widest flex items-center gap-3">
                                <FiActivity className="text-red-600" />
                                Departmental Insights
                            </h2>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Student Enrollment Distribution</p>
                        </div>
                        <button className="text-gray-300 hover:text-red-600 transition-colors">
                            <FiMoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {/* Fake Chart Placeholder / Visual */}
                         <div className="space-y-6">
                            {[
                                { name: "Computer Science", count: 420, total: 1000, color: "red" },
                                { name: "Management Studies", count: 310, total: 1000, color: "gray-900" },
                                { name: "Mechanical Eng.", count: 180, total: 1000, color: "gray-400" },
                                { name: "Basic Sciences", count: 125, total: 1000, color: "gray-200" },
                            ].map((dept, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase italic italic tracking-wider">
                                        <span className={dept.color === 'red' ? 'text-red-600' : 'text-gray-500'}>{dept.name}</span>
                                        <span className="text-gray-900">{Math.round((dept.count / 1000) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-${dept.color === 'red' ? 'red-600' : dept.color} transition-all duration-1000 delay-${i * 100}`}
                                            style={{ width: `${(dept.count / 1000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                         </div>

                         <div className="bg-gray-50/50 rounded-[2rem] p-8 flex flex-col justify-center border border-dashed border-gray-200">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                                    <FiBookOpen size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase italic text-gray-400 tracking-wider">Academics Status</p>
                                    <p className="text-sm font-black text-gray-800 uppercase italic">On Track • Quarter 2</p>
                                </div>
                             </div>
                             <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase italic">
                                Enrollment has increased by <span className="text-red-600 font-black">12.4%</span> since last semester. The Computer Science department remains the most high-demand vertical.
                             </p>
                             <button className="mt-8 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-900 shadow-sm hover:border-red-600 transition-all italic">
                                Download Annual Prospectus
                             </button>
                         </div>
                    </div>
                </div>

                {/* Vertical Sidebar Cards */}
                <div className="space-y-8">
                    {/* Schedule Snapshot */}
                    <div className="bg-[#111111] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden w-[98%] mx-auto lg:w-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-20"></div>
                        <h2 className="text-sm font-black uppercase italic tracking-widest mb-6 flex items-center gap-3">
                            <FiClock className="text-red-600" />
                            Live Timeline
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: "CS Dept Meeting", time: "11:30 AM", status: "Active" },
                                { title: "Admin Sync", time: "02:00 PM", status: "Pending" },
                                { title: "Faculty Review", time: "04:30 PM", status: "Pending" },
                            ].map((event, i) => (
                                <div key={i} className="flex items-start gap-4">
                                     <div className={`mt-1.5 w-2 h-2 rounded-full ${event.status === 'Active' ? 'bg-red-600 ring-4 ring-red-600/20' : 'bg-white/20'}`}></div>
                                     <div>
                                        <p className="text-[11px] font-black uppercase italic tracking-wider">{event.title}</p>
                                        <p className="text-[9px] text-white/40 font-black tracking-widest mt-0.5 uppercase italic">{event.time}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest italic transition-all">
                            Manage Calendar
                        </button>
                    </div>

                    {/* Quick Launch */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm w-[98%] mx-auto lg:w-full">
                        <h2 className="text-[10px] font-black uppercase italic text-gray-400 tracking-[0.2em] mb-6">Quick Launch</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: FiBookOpen, label: "Library" },
                                { icon: FiUsers, label: "Payroll" },
                                { icon: FiCalendar, label: "Exams" },
                                { icon: FiShield, label: "Logs" },
                            ].map((btn, i) => (
                                <button key={i} className="flex flex-col items-center gap-3 p-5 bg-gray-50/50 rounded-2xl hover:bg-black group transition-all duration-300">
                                    <btn.icon className="text-gray-400 group-hover:text-red-600 transition-colors" size={20} />
                                    <span className="text-[9px] font-black uppercase italic group-hover:text-white transition-colors tracking-widest">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
