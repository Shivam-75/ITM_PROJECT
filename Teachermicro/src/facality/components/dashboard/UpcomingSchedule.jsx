import { useMemo } from "react";

export default function UpcomingSchedule() {
  const schedule = useMemo(
    () => [
      { time: "10:00", title: "Intro to CS (CS101)", type: "Lecture" },
      { time: "14:00", title: "Department Meeting", type: "Meeting" },
      { time: "09:00", title: "Advanced Algorithms", type: "Lab" },
    ],
    []
  );

  return (
    <section className="bg-white border rounded-xl overflow-hidden">
      <header className="p-4 border-b font-bold">Upcoming Schedule</header>

      {schedule.map((item, idx) => (
        <div key={idx} className="p-4 hover:bg-slate-50 transition">
          <p className="font-semibold">{item.title}</p>
          <p className="text-xs text-slate-500">
            {item.time} • {item.type}
          </p>
        </div>
      ))}
    </section>
  );
}
