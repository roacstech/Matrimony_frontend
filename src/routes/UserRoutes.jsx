import { Routes, Route } from "react-router-dom";
import ConnectionCard from "../components/user/ConnectionCard";
import MyConnection from "../components/user/MyConnection";
import Profile from "../components/user/Profile";
import Notifications from "../components/user/Notifications";
import UserDashboard from "../components/user/UserDashboard";
import React from "react";

const UserRoutes = () => {
  
  return (
   <Routes>
      {/* LAYOUT ROUTE */}
      <Route path="dashboard" element={<UserDashboard />}>

        {/* DEFAULT PAGE */}
        <Route index element={<ConnectionCard />} />

        {/* OTHER PAGES */}
        <Route path="my-connection" element={<MyConnection />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />

      </Route>
    </Routes>
  );
};

export default UserRoutes;
