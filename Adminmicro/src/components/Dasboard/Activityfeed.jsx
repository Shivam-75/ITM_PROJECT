// admin/AdminComponents/ActivityFeed.jsx
import React, { memo, useMemo } from "react";

const Activityfeed = memo(() => {
  const activity = useMemo(
    () => [
      { text: "Fees ₹500 received from Ravi Kumar", time: "10m ago" },
      { text: "Attendance updated for BCA A1", time: "1h ago" },
      { text: "Exam schedule published for Jan", time: "3h ago" },
      { text: "New faculty account created: Dr. S. Patel", time: "1d ago" },
    ],
    [],
  );

  return (
    <ul className="space-y-2 text-sm">
      {activity.map((a, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
          <div>
            <div>{a.text}</div>
            <div className="text-xs text-gray-400">{a.time}</div>
          </div>
        </li>
      ))}
    </ul>
  );
});

export default Activityfeed;




