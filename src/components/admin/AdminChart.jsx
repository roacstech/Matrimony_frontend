import React, { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";
import PieChart from "../PieChart";

/* ================= CIRCULAR STAT COMPONENT ================= */
const CircularStat = ({ label, value, total, color1, color2 }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percentage) / 100;

  // ✅ Unique gradient ID (prevents collision)
  const gradientId = useMemo(
    () => `grad-${label.replace(/\s+/g, "-")}-${Math.random()}`,
    []
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[28px] shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">

          {/* ✅ Gradient Definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>

          {/* Background circle (Light Blue Tint) */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#B3CCFB"
            strokeOpacity="0.2"
            strokeWidth="8"
            fill="transparent"
          />

          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            fill="transparent"
            style={{
              animation: `progress 1.5s ease-out forwards`,
              "--offset": offset,
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute flex flex-col items-center animate-fade-in">
          <span className="text-xl sm:text-2xl font-black text-black">
            {value}
          </span>
          <span className="text-[10px] font-bold text-blue-600">{percentage}%</span>
        </div>
      </div>

      <h4 className="mt-3 sm:mt-4 text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest text-center group-hover:text-[#1A5AF0] transition-colors">
        {label}
      </h4>

      {/* Animations */}
      <style>{`
        @keyframes progress {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: var(--offset);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

/* ================= ADMIN DASHBOARD ================= */
const AdminChart = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = () => {
      getAdminDashboard()
        .then((data) => {
          setStats({
            totalUsers: Number(data.totalUsers),
            activeUsers: Number(data.activeUsers),
            inactiveUsers: Number(data.inactiveUsers),
            maleUsers: Number(data.maleUsers),
            femaleUsers: Number(data.femaleUsers),
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
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[40px] border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        {/* <h2 className="text-xl font-black text-black uppercase tracking-tight">Platform Analytics</h2> */}

        <div className="bg-[#B3CCFB]/20 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#1A5AF0] rounded-full animate-pulse"></div>
          <span className="text-[#1A5AF0] font-black text-xs uppercase tracking-widest">
            Total Users: {stats.totalUsers}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-6 font-bold">{error}</p>
      )}

      {/* Stats grid - Using Blue Color Palettes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Active: Dark Blue */}
        <CircularStat
          label="Active"
          value={stats.activeUsers}
          total={stats.totalUsers}
          color1="#1A5AF0"
          color2="#60A5FA"
        />

        {/* Inactive: Gray/Slate */}
        <CircularStat
          label="Inactive"
          value={stats.inactiveUsers}
          total={stats.totalUsers}
          color1="#64748b"
          color2="#cbd5e1"
        />

        {/* Male: Cyan/Blue */}
        <CircularStat
          label="Male"
          value={stats.maleUsers}
          total={stats.totalUsers}
          color1="#0EA5E9"
          color2="#BAE6FD"
        />

        {/* Female: Indigo/Violet */}
        <CircularStat
          label="Female"
          value={stats.femaleUsers}
          total={stats.totalUsers}
          color1="#4F46E5"
          color2="#C7D2FE"
        />
      </div>

      <div className="mt-12 bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
        <PieChart />
      </div>
    </div>
  );
};

export default AdminChart;