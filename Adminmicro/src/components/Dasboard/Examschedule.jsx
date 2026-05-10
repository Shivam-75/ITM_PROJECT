// admin/AdminComponents/ExamSchedule.jsx
import React, { memo, useMemo } from "react";

const Examschedule = memo(() => {
  const exams = useMemo(
    () => [
      { subject: "DBMS", date: "2026-02-05", time: "10:00 AM" },
      { subject: "Operating Systems", date: "2026-02-07", time: "10:00 AM" },
      { subject: "Web Development", date: "2026-02-10", time: "2:00 PM" },
    ],
    [],
  );

  return (
    <div className="space-y-3 text-sm">
      {exams.map((e, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <div>
            <div className="font-medium">{e.subject}</div>
            <div className="text-xs text-gray-500">{e.date}</div>
          </div>
          <div className="text-sm text-gray-700">{e.time}</div>
        </div>
      ))}
    </div>
  );
});

export default Examschedule;




