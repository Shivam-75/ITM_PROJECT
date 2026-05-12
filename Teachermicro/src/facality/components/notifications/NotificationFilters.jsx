export default function NotificationFilters({ filter, setFilter }) {
  const btnClass = (value) =>
    `px-4 py-2 rounded-[10px] text-sm font-medium border transition
     ${
       filter === value
         ? "bg-blue-600 text-white border-blue-600"
         : "bg-white text-slate-600 hover:bg-white"
     }`;

  return (
    <div className="flex gap-2">
      <button className={btnClass("all")} onClick={() => setFilter("all")}>
        All
      </button>
      <button
        className={btnClass("unread")}
        onClick={() => setFilter("unread")}>
        Unread
      </button>
    </div>
  );
}



