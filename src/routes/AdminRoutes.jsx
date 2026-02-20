import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";

import AdminChart from "../components/admin/AdminChart";
import Alluser from "../components/admin/Alluser";
import PendingForm from "../components/admin/PendingForm";

const AdminRoutes = () => {
    const token = localStorage.getItem("accesstoken");
  const roleid = Number(localStorage.getItem("roleid"));

  console.log("✅ ADMIN ROUTE MOUNTED");

  if (!token || roleid !== 1) {
    return <Navigate to="/" replace />;
  }
 
  return (
    <Routes>
      <Route element={<AdminDashboardLayout />}>
        {/* default admin page */}
        <Route index element={<AdminChart />} />

        {/* admin pages */}
        <Route path="chart" element={<AdminChart />} />
        <Route path="all-users" element={<Alluser />} />
        <Route path="pending-forms" element={<PendingForm />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
