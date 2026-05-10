const actions = [
  { icon: "add_circle", label: "Create Course" },
  { icon: "calendar_add_on", label: "Office Hours" },
  { icon: "grading", label: "Grade Reports" },
  { icon: "campaign", label: "Announce" },
];

export default function QuickActions() {
  return (
    <section>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600">bolt</span>
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((a) => (
          <button
            key={a.label}
            className="p-4 border rounded-lg hover:border-blue-500 hover:shadow transition flex flex-col items-center gap-2"
          >
            <span className="material-symbols-outlined text-blue-600">
              {a.icon}
            </span>
            <span className="text-sm font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}



