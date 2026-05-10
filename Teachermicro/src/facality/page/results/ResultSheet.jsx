export const StatCard = ({ label, value, color = "text-gray-800" }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);



