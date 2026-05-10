import React from "react";

const NotificationBell = () => {
  const notificationCount = 3; // future me API se aayega

  return (
    <div className="relative cursor-pointer">
      <span className="text-2xl">🔔</span>

      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
          {notificationCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;




