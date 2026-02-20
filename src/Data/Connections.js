import { users } from "./Users";

export const connections = [
  { id: 1, from: 2, to: 1, status: "Received" ,  createdAt: "2026-01-30T10:30:00",},
  { id: 2, from: 3, to: 1, status: "Received" ,  createdAt: "2026-02-02T10:30:00",},
  { id: 3, from: 1, to: 4, status: "Request Sent",createdAt: "2026-02-23T08:00:00" },
  { id: 4, from: 1, to: 5, status: "Request Sent",createdAt: "2026-01-30T08:00:00" },
];


let connectionsData = [...connections];

export const getReceivedConnections = (userId) => {
  return connectionsData.filter(
    (c) => c.to === userId && c.status === "Received"
  );
};

export const ignoreConnection = (connectionId) => {
  connectionsData = connectionsData.filter((c) => c.id !== connectionId);
};

export const clearAllReceived = (userId) => {
  connectionsData = connectionsData.filter((c) => c.to !== userId);
};

export const getUserById = (id) => {
  return users.find((u) => u.id === id);
};

