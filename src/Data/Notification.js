import { users } from "./Users";

// 🔔 Dummy notifications (mutable for dummy project)
let notifications = [
  {
    id: 1,
    type: "ADMIN_APPROVAL",
    message: "Admin approved your profile",
    isRead: false,
  },
  {
    id: 2,
    type: "CONNECTION_REQUEST",
    fromUserId: 2,
    isRead: false,
  },
];

// helper
const getUserById = (id) => users.find((u) => u.id === id);

// 🧠 GET notifications
export const getUserNotifications = () => {
  return notifications.map((n) => {
    if (n.type === "CONNECTION_REQUEST") {
      const fromUser = getUserById(n.fromUserId);
      return {
        ...n,
        message: fromUser
          ? `${fromUser.name} sent you a connection request`
          : "Someone sent you a connection request",
      };
    }
    return n;
  });
};

// ❌ CLOSE ONE notification
export const removeNotification = (id) => {
  notifications = notifications.filter((n) => n.id !== id);
};

// 🧹 CLEAR ALL notifications
export const clearAllNotifications = () => {
  notifications = [];
};
