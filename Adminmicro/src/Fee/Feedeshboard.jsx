import React from "react";
import { 
  FiDollarSign, 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiActivity
} from "react-icons/fi";

/* 🔹 Professional Stat Card */
const StatCard = ({ title, value, icon, subValue, trend, colorClass }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${colorClass.replace('bg-', 'bg-')}/10 flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 24, className: colorClass.replace('bg-', 'text-') })}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-[10px] font-black italic">
          <FiArrowUpRight size={12} />
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">{value}</h3>
      </div>
      {subValue && (
        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{subValue}</p>
      )}
    </div>
  </div>
);

const Feedashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Fee Management <span className="text-red-600">Core</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
            <FiActivity className="text-red-600" />
            Financial Intelligence & Revenue Tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm italic">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-[#111111] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 italic border border-white/5">
            Collect Fee
          </button>
        </div>
      </div>

      {/* 🔹 Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="₹1,63,000"
          subValue="Current Session"
          icon={<FiDollarSign />}
          trend="+12.5%"
          colorClass="bg-blue-600"
        />
        <StatCard
          title="Collections"
          value="₹1,14,000"
          subValue="70% Realized"
          icon={<FiCheckCircle />}
          trend="+8.2%"
          colorClass="bg-emerald-600"
        />
        <StatCard
          title="Outstanding"
          value="₹49,000"
          subValue="Pending Actions"
          icon={<FiClock />}
          colorClass="bg-red-600"
        />
        <StatCard
          title="Student Base"
          value="1,240"
          subValue="Active Enrolments"
          icon={<FiUsers />}
          colorClass="bg-orange-600"
        />
      </div>
    </div>
  );
};

export default Feedashboard;
