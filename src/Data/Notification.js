// import { users } from "./Users";

// // 🔔 Dummy notifications
// let notifications = [
//   {
//     id: 1,
//     type: "ADMIN_APPROVAL",
//     message: "Admin approved your profile",
//     isRead: false,
//   },
//   {
//     id: 2,
//     type: "CONNECTION_REQUEST",
//     fromUserId: 2, // Priya
//     isRead: false,
//   },
//   {
//     id: 3,
//     type: "CONNECTION_ACCEPTED",
//     fromUserId: 3, // Divya
//     isRead: false,
//   },
// ];

// // helper
// const getUserById = (id) => users.find((u) => u.id === id);

// // 🧠 GET notifications
// export const getUserNotifications = () => {
//   return notifications.map((n) => {
//     const fromUser = n.fromUserId
//       ? getUserById(n.fromUserId)
//       : null;

//     switch (n.type) {
//       case "CONNECTION_REQUEST":
//         return {
//           ...n,
//           message: fromUser?.fullName
//             ? `${fromUser.fullName} sent you a connection request`
//             : "Someone sent you a connection request",
//         };

//       case "CONNECTION_ACCEPTED":
//         return {
//           ...n,
//           message: fromUser?.fullName
//             ? `${fromUser.fullName} accepted your connection request`
//             : "Your connection request was accepted",
//         };

//       default:
//         return n;
//     }
//   });
// };

// // ❌ Remove one
// export const removeNotification = (id) => {
//   notifications = notifications.filter((n) => n.id !== id);
// };

// // 🧹 Clear all
// export const clearAllNotifications = () => {
//   notifications = [];
// };

import { users } from "./Users";

const STORAGE_KEY = "notifications";

// helper
const getUserById = (id) => users.find((u) => u.id === id);

// 🔔 GET notifications (current user)
export const getUserNotifications = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return [];

  const notifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  return notifications
    .filter((n) => n.userId === currentUser.id)
    .map((n) => {
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

// ➕ ADD notification
export const addNotification = (notification) => {
  const notifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  notifications.unshift({
    id: Date.now(),
    isRead: false,
    createdAt: new Date().toISOString(),
    ...notification,
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );
};

// ❌ Remove one
export const removeNotification = (id) => {
  const notifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const updated = notifications.filter((n) => n.id !== id);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};

// 🧹 Clear all (current user only)
export const clearAllNotifications = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;

  const notifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const updated = notifications.filter(
    (n) => n.userId !== currentUser.id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
};
