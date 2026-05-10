const icons = {
  assignment: "assignment_turned_in",
  announcement: "campaign",
  system: "settings",
  student: "person",
};

export default function NotificationItem({ data }) {
  return (
    <div
      className={`flex gap-4 p-4 border-b last:border-b-0 transition
      ${data.unread ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-white"}`}>
      {/* Icon */}
      <div
        className={`size-10 rounded-full flex items-center justify-center
        ${
          data.unread ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
        }`}>
        <span className="material-symbols-outlined">{icons[data.type]}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-sm">{data.title}</p>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {data.time}
          </span>
        </div>

        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
          {data.message}
        </p>
      </div>
      {data.unread && <span className="size-2 rounded-full bg-blue-600 mt-2" />}
    </div>
  );
}



