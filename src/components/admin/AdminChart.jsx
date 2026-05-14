import React, { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";
import PieChart from "../PieChart";
import { UserCheck, UserX, User, Users } from "lucide-react";
import adminImage from "../../assets/Admin-cuate.svg";

/* ================= FLAT STAT CARD ================= */
const StatCard = ({ label, value, icon: Icon, bgColor, iconColor }) => (
  <div className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 px-6 py-5">
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: 52, height: 52, backgroundColor: bgColor }}
    >
      <Icon size={22} color={iconColor} />
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 leading-none">
        {value}
      </p>
    </div>
  </div>
);

/* ================= MAIN DASHBOARD ================= */
const AdminChart = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
  });

  const [error, setError] = useState("");

  // Dynamic date and greeting
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();

  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  useEffect(() => {
    const fetchStats = () => {
      getAdminDashboard()
        .then((data) => {
          setStats({
            totalUsers: Number(data.totalUsers) || 0,
            activeUsers: Number(data.activeUsers) || 0,
            inactiveUsers: Number(data.inactiveUsers) || 0,
            maleUsers: Number(data.maleUsers) || 0,
            femaleUsers: Number(data.femaleUsers) || 0,
          });
          setError("");
        })
        .catch(() => setError("Failed to load dashboard data"));
    };

    fetchStats();

    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-8 text-white flex justify-between items-center"
        style={{
          background: "linear-gradient(90deg, #1E3A8A, #2563EB)",
        }}
      >
        <div>
          <p className="text-sm opacity-85">{formattedDate}</p>

          <h1 className="text-3xl font-semibold mt-1 mb-1">
            {greeting}, Admin 👋
          </h1>

          <p className="text-sm opacity-85">
            Here's what's happening with your platform.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <img
            src={adminImage}
            alt="Admin"
            className="w-40 h-40 object-contain"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Active Users"
          value={stats.activeUsers}
          icon={UserCheck}
          bgColor="#EFF6FF"
          iconColor="#1E40AF"
        />
        <StatCard
          label="Inactive Users"
          value={stats.inactiveUsers}
          icon={UserX}
          bgColor="#F1F5F9"
          iconColor="#475569"
        />
        <StatCard
          label="Male Members"
          value={stats.maleUsers}
          icon={User}
          bgColor="#E0F2FE"
          iconColor="#0369A1"
        />
        <StatCard
          label="Female Members"
          value={stats.femaleUsers}
          icon={Users}
          bgColor="#F3E8FF"
          iconColor="#6B21A8"
        />
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
        <PieChart />
      </div>
    </div>
  );
};

export default AdminChart;
