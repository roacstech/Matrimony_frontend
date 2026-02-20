import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { users } from "../../Data/Users";
import { connections as allConnections } from "../../Data/Connections";
import UserDashboardLayout from "../../layouts/UserDashboardLayout";

const UserDashboard = () => {
    console.log("✅ UserDashboard rendered");
  const user = users[0]; // simulate logged in user

  const [showMenu, setShowMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("connections");

  return (
    <UserDashboardLayout
      user={user}
      completion={80}
      connections={allConnections}
      showMenu={showMenu}
      onAvatarClick={() => setShowMenu(!showMenu)}
      activeSection={activeSection}
      onMenuChange={setActiveSection}
    >
      {/* 👇 THIS IS THE KEY */}
      <Outlet />
    </UserDashboardLayout>
  );
};

export default UserDashboard;




