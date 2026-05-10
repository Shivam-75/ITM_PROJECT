import React, { useState, useEffect } from "react";
import { FiPlus, FiUsers, FiHome, FiClock, FiRefreshCw, FiShield } from "react-icons/fi";
import { HostelService } from "../../api/apis";
import { toast } from "react-toastify";

const HostelRegistration = () => {
    const [allotments, setAllotments] = useState([]);
    const [recentAllotments, setRecentAllotments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllotments = async () => {
        try {
            setLoading(true);
            const res = await HostelService.getAllotments();
            const data = res.data.allotments || [];
            setAllotments(data);
            
            // 🔹 Filter for Last 24 Hours
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recent = data.filter(item => new Date(item.createdAt) > oneDayAgo);
            setRecentAllotments(recent);
        } catch (error) {
            toast.error("Failed to fetch allotment data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllotments();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Hostel <span className="text-red-600">Registration</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                        <FiShield className="text-red-600" />
                        Live Registry • rolling 24h tracking
                    </p>
                </div>
                
                <button
                    onClick={fetchAllotments}
                    className="p-3 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-all shadow-sm active:scale-95"
                >
                    <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Recent Allotments (24h) */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-white/30 flex items-center justify-between">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic flex items-center gap-2">
                        <FiClock className="text-red-600" /> Recent Registrations (Last 24h)
                    </h2>
                    <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full italic uppercase">
                        {recentAllotments.length} New Entries
                    </span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Student ID</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Full Name</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Room / Block</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentAllotments.length > 0 ? (
                                recentAllotments.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/50 transition-all">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black bg-white px-2 py-1 rounded border border-gray-200">{item.studentId}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-black uppercase italic text-gray-700">{item.studentName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase text-gray-900 italic">Room {item.roomNumber}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase italic">Block {item.block}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[9px] font-black text-gray-500 uppercase italic">
                                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-300 italic font-black uppercase tracking-widest text-[10px]">No recent registrations in last 24h</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* General Registry Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <FiUsers className="text-red-600 mb-4" size={24} />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Total Allotments</h3>
                    <p className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{allotments.length}</p>
                </div>
                <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                    <FiHome className="text-blue-600 mb-4" size={24} />
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Hostel Inventory</h3>
                    <p className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">Live</p>
                </div>
                <div className="bg-[#111111] p-8 rounded-lg shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-full blur-2xl -mr-12 -mt-12"></div>
                    <FiShield className="text-red-600 mb-4" size={24} />
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Registry Integrity</h3>
                    <p className="text-3xl font-black text-white mt-2 tracking-tighter">Verified</p>
                </div>
            </div>
        </div>
    );
};

export default HostelRegistration;



