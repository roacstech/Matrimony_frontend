import React from "react";
import { Routes, Route } from "react-router-dom";

import ConnectionCard from "./ConnectionCard";
import ReceivedConnections from "./ReceivedConnections";
import SentConnections from "./SentConnections";
import Profile from "./Profile";
import Notifications from "./Notifications";
import UserDashboard from "./UserDashboard";
import React from "react";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<UserDashboard />}>
        {/* DEFAULT PAGE */}
        <Route index element={<ConnectionCard />} />

        {/* CONNECTIONS */}
        <Route path="my-connection/received" element={<ReceivedConnections />} />
        <Route path="my-connection/sent" element={<SentConnections />} />

        {/* OTHER PAGES */}
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;