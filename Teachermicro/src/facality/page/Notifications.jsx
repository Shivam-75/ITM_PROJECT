import { useState, useMemo } from "react";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationItem from "../components/notifications/NotificationItem";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const notifications = useMemo(
    () => [
      {
        id: 1,
        type: "assignment",
        title: "New Assignment Submission",
        message: "Alex Johnson submitted CS101 Assignment 3.",
        time: "2 min ago",
        unread: true,
      },
      {
        id: 2,
        type: "announcement",
        title: "Department Announcement",
        message: "Faculty meeting rescheduled to Friday 2 PM.",
        time: "1 hour ago",
        unread: true,
      },
      {
        id: 3,
        type: "system",
        title: "System Update",
        message: "Dashboard performance improvements deployed.",
        time: "Yesterday",
        unread: false,
      },
      {
        id: 4,
        type: "student",
        title: "Student Message",
        message: "Sarah Williams asked about midterm evaluation.",
        time: "2 days ago",
        unread: false,
      },
    ],
    []
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => n.unread);
    }
    return notifications;
  }, [filter, notifications]);

  return (
    <div className="w-full flex flex-col gap-6 px-[6%] py-[6%]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Notifications</h1>
          <p className="text-slate-500">
            Stay updated with student activities & system alerts.
          </p>
        </div>

        <button className="px-4 py-2 rounded-[10px] border bg-white text-sm font-medium hover:bg-white">
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <NotificationFilters filter={filter} setFilter={setFilter} />

      {/* Notification List */}
      <div className="bg-white border rounded-[10px] overflow-hidden shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <NotificationItem key={item.id} data={item} />
          ))
        )}
      </div>
    </div>
  );
}



