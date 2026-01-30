import { Routes, Route } from "react-router-dom";
import UserDashboard from "../components/user/UserDashboard";
import ConnectionCard from "../components/user/ConnectionCard";
import MyConnection from "../components/user/MyConnection";
import Profile from "../components/user/Profile";
import Notifications from "../components/user/Notifications";
import React from "react";

const UserRoutes = () => {
  return (
    <Routes>
      {/* ALL USER PAGES USE SAME LAYOUT */}
      <Route element={<UserDashboard />}>
        <Route path="dashboard" element={<ConnectionCard />} />
        <Route path="my-connection" element={<MyConnection />} />
        {/* 🔥 FIX HERE */}
        <Route path="profile/:id" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
