import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiUsers, FiHome, FiCheckSquare, FiAlertCircle, 
  FiClipboard, FiFileText, FiMapPin, FiActivity 
} from "react-icons/fi";
import Loader from "../../Loader";

const StatCard = ({ title, value, icon, subtext, color = "indigo" }) => (
  <div className="bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/40 p-6 flex flex-col group transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
        <div className={`p-3 bg-white text-slate-400 rounded-lg group-hover:bg-${color}-600 group-hover:text-white transition-all`}>
            {icon}
        </div>
        <span className="text-[8px] font-black text-slate-200 uppercase tracking-widest italic tracking-tighter shadow-sm px-2 py-1 rounded bg-white">Active Protocol</span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">
      {title}
    </p>
    <div className="flex items-baseline gap-2">
        <p className="text-3xl font-[900] text-slate-900 tracking-tighter">
          {value}
        </p>
        <span className="text-[10px] font-black text-emerald-500 uppercase italic">/ {subtext}</span>
    </div>
  </div>
);

const Hosteldeshboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalResidents: 0,
        totalInventory: 0,
        occupiedSpace: 0,
        vacantUnits: 0,
        grievances: 0,
        pendingAction: 0,
        financialRecords: 0,
        exitProtocols: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentRes, payRes, roomsRes, compRes] = await Promise.all([
                axios.get("http://localhost:5001/api/v1/Admin/StudentList", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Payment/history", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/rooms", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/complaints", { withCredentials: true })
            ]);

            const allStudents = studentRes.data.studentList || studentRes.data.data || [];
            const hostelers = allStudents.filter(s => s.isHostel === true || s.isHostel === "true");
            const payments = payRes.data.payments || payRes.data.data || [];
            const rooms = roomsRes.data.rooms || roomsRes.data.data || [];

            // Financial Calculations
            const expectedTotal = hostelers.reduce((sum, s) => sum + Number(s.hostelFee || 0), 0);
            const actualCollected = payments
                .filter(p => p.paymentType === "Hostel")
                .reduce((sum, p) => sum + Number(p.amount || 0), 0);

            const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
            const occupied = rooms.reduce((acc, r) => acc + (r.occupiedBeds || 0), 0);
            
            setStats({
                totalResidents: hostelers.length,
                totalRevenue: expectedTotal,
                totalCollected: actualCollected,
                pendingDues: Math.max(0, expectedTotal - actualCollected),
                totalInventory: rooms.length,
                vacantUnits: totalCapacity - occupied,
                grievances: compRes.data.complaints?.length || 0,
                pendingAction: compRes.data.complaints?.filter(c => c.status === "Pending").length || 0
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen p-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                        <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                        Hostel Analytics
                    </h1>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] italic mt-2 ml-6">
                        Real-time Residential Intelligence & Node Status
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">Last Node Sync</p>
                        <p className="text-sm font-black text-slate-900 italic uppercase">Just Now</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
                        <FiActivity size={24} className="animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Hostelers"
                    value={stats.totalResidents}
                    subtext="Registered Students"
                    icon={<FiUsers size={20} />}
                    color="indigo"
                />
                <StatCard
                    title="Expected Fees"
                    value={`₹${stats.totalRevenue?.toLocaleString()}`}
                    subtext="Target Revenue"
                    icon={<FiFileText size={20} />}
                    color="blue"
                />
                <StatCard
                    title="Actual Collection"
                    value={`₹${stats.totalCollected?.toLocaleString()}`}
                    subtext="Secured Funds"
                    icon={<FiCheckSquare size={20} />}
                    color="emerald"
                />
                <StatCard
                    title="Outstanding Dues"
                    value={`₹${stats.pendingDues?.toLocaleString()}`}
                    subtext="Pending Recovery"
                    icon={<FiAlertCircle size={20} />}
                    color="rose"
                />
                <StatCard
                    title="Room Inventory"
                    value={stats.totalInventory}
                    subtext="Allocated Blocks"
                    icon={<FiHome size={20} />}
                    color="amber"
                />
                <StatCard
                    title="Vacant Beds"
                    value={stats.vacantUnits}
                    subtext="Available Space"
                    icon={<FiMapPin size={20} />}
                    color="sky"
                />
                <StatCard
                    title="Open Grievances"
                    value={stats.grievances}
                    subtext="Pending Resolution"
                    icon={<FiClipboard size={20} />}
                    color="orange"
                />
                <StatCard
                    title="Protocol Status"
                    value="Active"
                    subtext="Node Operations"
                    icon={<FiActivity size={20} />}
                    color="slate"
                />
            </div>
        </div>
    );
};

export default Hosteldeshboard;
