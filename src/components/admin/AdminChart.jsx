import React, { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../api/adminApi";

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
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[28px] shadow-sm border border-[#EEEEEE] hover:shadow-md transition-all group">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">

          {/* ✅ Gradient Definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#FAF6F3"
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
          <span className="text-xl sm:text-2xl font-black text-[#5D4037]">
            {value}
          </span>
        </div>
      </div>

      <h4 className="mt-3 sm:mt-4 text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest text-center group-hover:text-[#5D4037] transition-colors">
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
    <div className="bg-[#FAF6F3]/50 p-4 sm:p-6 md:p-8 rounded-[40px] border border-[#EEEEEE]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
       

        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-2 h-2 bg-[#A67C52] rounded-full animate-pulse"></div>
          <span className="text-[#5D4037] font-black text-xs uppercase tracking-widest">
            Total Users: {stats.totalUsers}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mb-6">{error}</p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <CircularStat
          label="Active"
          value={stats.activeUsers}
          total={stats.totalUsers}
          color1="#5D4037"
          color2="#8D6E63"
        />

        <CircularStat
          label="Inactive"
          value={stats.inactiveUsers}
          total={stats.totalUsers}
          color1="#9E9E9E"
          color2="#EEEEEE"
        />

        <CircularStat
          label="Male"
          value={stats.maleUsers}
          total={stats.totalUsers}
          color1="#A67C52"
          color2="#D7CCC8"
        />

        <CircularStat
          label="Female"
          value={stats.femaleUsers}
          total={stats.totalUsers}
          color1="#D4A373"
          color2="#FAEDCD"
        />
      </div>
    </div>
  );
};

export default AdminChart;
