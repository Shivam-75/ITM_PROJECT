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
            const [allocRes, roomsRes, compRes, feeRes] = await Promise.all([
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/allocate", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/rooms", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/complaints", { withCredentials: true }),
                axios.get("http://localhost:5002/api/v3/Admin/Hostel/fees", { withCredentials: true })
            ]);

            const totalCapacity = roomsRes.data.rooms?.reduce((acc, r) => acc + r.capacity, 0) || 0;
            const occupied = roomsRes.data.rooms?.reduce((acc, r) => acc + r.occupied, 0) || 0;
            
            setStats({
                totalResidents: occupied,
                totalInventory: roomsRes.data.rooms?.length || 0,
                occupiedSpace: occupied,
                vacantUnits: totalCapacity - occupied,
                grievances: compRes.data.complaints?.length || 0,
                pendingAction: compRes.data.complaints?.filter(c => c.status === "Pending").length || 0,
                financialRecords: feeRes.data.fees?.length || 0,
                exitProtocols: 0 // Mock or from separate API
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
        <div className="min-h-screen bg-white p-8 animate-in fade-in duration-700">
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
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
                        <FiActivity size={24} className="animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    title="Total Residents"
                    value={stats.totalResidents}
                    subtext="Node Occupancy"
                    icon={<FiUsers size={20} />}
                    color="indigo"
                />
                <StatCard
                    title="Total Inventory"
                    value={stats.totalInventory}
                    subtext="Active Rooms"
                    icon={<FiHome size={20} />}
                    color="blue"
                />
                <StatCard
                    title="Occupied Space"
                    value={stats.occupiedSpace}
                    subtext="Beds Allotted"
                    icon={<FiCheckSquare size={20} />}
                    color="emerald"
                />
                <StatCard
                    title="Vacant Units"
                    value={stats.vacantUnits}
                    subtext="Ready Units"
                    icon={<FiMapPin size={20} />}
                    color="rose"
                />
                <StatCard
                    title="Official Grievances"
                    value={stats.grievances}
                    subtext="Audit Logs"
                    icon={<FiAlertCircle size={20} />}
                    color="amber"
                />
                <StatCard
                    title="Pending Action"
                    value={stats.pendingAction}
                    subtext="High Priority"
                    icon={<FiClipboard size={20} />}
                    color="orange"
                />
                <StatCard
                    title="Financial Records"
                    value={stats.financialRecords}
                    subtext="Fee Entries"
                    icon={<FiFileText size={20} />}
                    color="sky"
                />
                <StatCard
                    title="Exit Protocols"
                    value={stats.exitProtocols}
                    subtext="Release Requests"
                    icon={<FiFileText size={20} />}
                    color="slate"
                />
            </div>
        </div>
    );
};

export default Hosteldeshboard;
