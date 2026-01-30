import React, { useState } from "react";
import {
  getUserNotifications,
  removeNotification,
  clearAllNotifications,
} from "../../Data/Notification";

const Notifications = () => {
  const [list, setList] = useState(getUserNotifications());

  const handleRemove = (id) => {
    removeNotification(id);
    setList(getUserNotifications());
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setList([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>

        {list.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        list.map((n) => (
          <div
            key={n.id}
            className="flex justify-between items-start p-4 bg-white rounded-xl shadow border"
          >
            <p className="text-sm">{n.message}</p>

            <button
              onClick={() => handleRemove(n.id)}
              className="text-gray-400 hover:text-red-500 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
