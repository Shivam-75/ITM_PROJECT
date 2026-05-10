function AttendanceHeader({ showData, setShowData }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-black text-gray-800">
        Attendance Management
      </h1>

      {/* Show / Hide Button */}
      <button
        onClick={() => setShowData((prev) => !prev)}
        className="px-4 py-2 rounded-lg text-sm font-semibold
                   bg-[var(--primary)] text-white hover:opacity-90"
      >
        {showData ? "Hide Data" : "Show Data"}
      </button>
    </div>
  );
}

export default AttendanceHeader;
