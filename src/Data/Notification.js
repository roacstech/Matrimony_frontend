import { users } from "./Users";

// 🔔 Dummy notifications
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
    fromUserId: 2, // Priya
    isRead: false,
  },
  {
    id: 3,
    type: "CONNECTION_ACCEPTED",
    fromUserId: 3, // Divya
    isRead: false,
  },
];

// helper
const getUserById = (id) => users.find((u) => u.id === id);

// 🧠 GET notifications
export const getUserNotifications = () => {
  return notifications.map((n) => {
    const fromUser = n.fromUserId
      ? getUserById(n.fromUserId)
      : null;

    switch (n.type) {
      case "CONNECTION_REQUEST":
        return {
          ...n,
          message: fromUser?.fullName
            ? `${fromUser.fullName} sent you a connection request`
            : "Someone sent you a connection request",
        };

      case "CONNECTION_ACCEPTED":
        return {
          ...n,
          message: fromUser?.fullName
            ? `${fromUser.fullName} accepted your connection request`
            : "Your connection request was accepted",
        };

      default:
        return n;
    }
  });
};

// ❌ Remove one
export const removeNotification = (id) => {
  notifications = notifications.filter((n) => n.id !== id);
};

// 🧹 Clear all
export const clearAllNotifications = () => {
  notifications = [];
};
