// admin/AdminComponents/UpcomingEvents.jsx
import React, { memo, useMemo } from "react";

const Upcomingevents = memo(() => {
  const events = useMemo(
    () => [
      { title: "Orientation Day", date: "2026-02-01", venue: "Main Hall" },
      { title: "Maths Workshop", date: "2026-02-08", venue: "Room 204" },
      { title: "Sports Week", date: "2026-02-20", venue: "Ground" },
    ],
    [],
  );

  return (
    <div className="space-y-3 text-sm">
      {events.map((e, idx) => (
        <div key={idx} className="flex justify-between">
          <div>
            <div className="font-medium">{e.title}</div>
            <div className="text-xs text-gray-500">{e.venue}</div>
          </div>
          <div className="text-sm text-gray-700">{e.date}</div>
        </div>
      ))}
    </div>
  );
});

export default Upcomingevents;
