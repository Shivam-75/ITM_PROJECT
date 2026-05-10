export default function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between mb-2">
        <p className="text-sm text-slate-500">{title}</p>
        <span className={`material-symbols-outlined text-${color}-500`}>
          {icon}
        </span>
      </div>

      <p className="text-3xl font-bold">{value}</p>

      {trend && (
        <p className="text-xs text-green-600 mt-1">
          {trend} this semester
        </p>
      )}
    </div>
  );
}
