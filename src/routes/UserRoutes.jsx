import React from "react";
import { Routes, Route } from "react-router-dom";

import ConnectionCard from "../components/user/ConnectionCard";
import Receivedconnections from "../components/user/Receivedconnections";
import Sentconnections from "../components/user/Sentconnections";
import Profile from "../components/user/Profile";
import Notifications from "../components/user/Notifications";
import UserDashboard from "../components/user/UserDashboard";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<UserDashboard />}>
        <Route index element={<ConnectionCard />} />

        <Route
          path="my-connection/received"
          element={<Receivedconnections />}
        />

        <Route
          path="my-connection/sent"
          element={<Sentconnections />}
        />

        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;