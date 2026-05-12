const courses = [
  { name: "Intro to CS", progress: 75, color: "bg-white border border-slate-1000" },
  { name: "Data Structures", progress: 45, color: "bg-orange-500" },
  { name: "Web Development", progress: 90, color: "bg-green-500" },
];

export default function CourseProgress() {
  return (
    <section className="bg-white p-6 border rounded-[10px]">
      <h3 className="font-bold mb-4">Active Courses Progress</h3>

      {courses.map((c) => (
        <div key={c.name} className="mb-5">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold">{c.name}</span>
            <span className="text-sm">{c.progress}%</span>
          </div>

          <div className="h-2 bg-slate-200 rounded-full">
            <div
              className={`${c.color} h-2 rounded-full`}
              style={{ width: `${c.progress}%` }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}



