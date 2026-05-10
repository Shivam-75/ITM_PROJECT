// admin/AdminComponents/AttendanceSummary.jsx
import React, { memo, useMemo } from "react";
import Chart from "./Chart";
// import Chart from "./Chart";

const Attendancesummary = memo(() => {
  const weekly = useMemo(
    () => [
      { label: "Mon", value: 90 },
      { label: "Tue", value: 88 },
      { label: "Wed", value: 92 },
      { label: "Thu", value: 93 },
      { label: "Fri", value: 91 },
      { label: "Sat", value: 85 },
      { label: "Sun", value: 0 },
    ],
    [],
  );

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">This week</div>
      <div className="w-full">
        <Chart data={weekly} height={80} type="line" />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <div>Average: 90%</div>
        <div>Present: 1,128</div>
      </div>
    </div>
  );
});

export default Attendancesummary;




