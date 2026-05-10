// admin/AdminComponents/RecentAdmissions.jsx
import React, { memo, useMemo } from "react";

const RecentAdmissionss = memo(() => {
  const admissions = useMemo(
    () => [
      { name: "Ravi Kumar", course: "BCA", date: "2026-01-15" },
      { name: "Neha Sharma", course: "BSc IT", date: "2026-01-14" },
      { name: "Aman Verma", course: "BCA", date: "2026-01-12" },
      { name: "Priya Singh", course: "BCA", date: "2026-01-11" },
    ],
    [],
  );

  return (
    <div className="space-y-3">
      {admissions.map((a, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
            {a.name
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex-1">
            <div className="font-medium">{a.name}</div>
            <div className="text-xs text-gray-500">
              {a.course} • {a.date}
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">Active</div>
        </div>
      ))}
    </div>
  );
});

export default RecentAdmissionss;




