import React, { useEffect, useState } from "react";
import {
  getUserNotifications,
  removeNotification,
  clearAllNotifications,
} from "../../Data/Notification";

const Notifications = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    setList(getUserNotifications());
  }, []);

  const handleRemove = (id) => {
    removeNotification(id);
    setList(getUserNotifications());
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setList([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold">
          Notifications ({list.length})
        </h2>

        {list.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-5 py-2 bg-red-500 text-white rounded-full text-xs font-black uppercase"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-center text-gray-400">
            No notifications
          </p>
        ) : (
          list.map((n) => (
            <div
              key={n.id}
              className="flex justify-between items-center p-4 bg-white border rounded-xl"
            >
              <p className="font-medium">{n.message}</p>

              <button
                onClick={() => handleRemove(n.id)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
