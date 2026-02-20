// Data/UpdateProfile.js
import { users as initialUsers } from "./Users";

let usersData = [...initialUsers];

export const getUserById = (id) => {
  return usersData.find((u) => u.id === id);
};

export const updateUser = (updatedUser) => {
  usersData = usersData.map((u) =>
    u.id === updatedUser.id ? updatedUser : u
  );
};

export const deleteUser = (id) => {
  usersData = usersData.filter((u) => u.id !== id);
};

export const getAllUsers = () => usersData;
