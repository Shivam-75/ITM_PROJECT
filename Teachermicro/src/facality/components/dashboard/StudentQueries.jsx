export default function StudentQueries() {
  return (
    <section className="bg-white border rounded-[10px]">
      <header className="p-4 border-b font-bold flex justify-between">
        Student Queries
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
          3 New
        </span>
      </header>

      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold">Alex Johnson</p>
        <p className="text-xs text-slate-500">
          Question regarding assignment deadline...
        </p>
      </div>
    </section>
  );
}



