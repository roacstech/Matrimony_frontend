import React from "react";

/* ================= CIRCULAR STAT COMPONENT ================= */
const CircularStat = ({ label, value, total, color1, color2 }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  
  // Inga dhaan logic: Initial-a circumference motham cover panni irukkum (empty)
  // Animation moolama namma set panna offset-ku varum.
  const offset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[28px] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={`url(#grad-${label.replace(/\s+/g, '-')})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference} // Start from empty
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-[1500ms] ease-out animate-load-spin"
            style={{ 
              "--target-offset": offset,
              animation: `spin-load 1.5s ease-out forwards` 
            }}
          />
          <defs>
            <linearGradient id={`grad-${label.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute flex flex-col items-center animate-fade-in">
          <span className="text-xl sm:text-2xl font-black text-[#3B1E54]">
            {value}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {percentage}%
          </span>
        </div>
      </div>

      <h4 className="mt-3 sm:mt-4 text-[10px] sm:text-[12px] font-black text-gray-500 uppercase tracking-widest text-center group-hover:text-[#3B1E54] transition-colors">
        {label}
      </h4>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin-load {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: var(--target-offset);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

/* ================= ADMIN CHART ================= */
const AdminChart = () => {
  const stats = {
    totalUsers: 120,
    activeUsers: 82,
    inactiveUsers: 38,
    maleUsers: 70,
    femaleUsers: 50,
  };

  return (
    <div className="bg-[#F8FAFC] p-4 sm:p-6 md:p-8 rounded-[40px] animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#3B1E54] tracking-tight">
            System Insights
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[3px] mt-1">
            Real-time user distribution
          </p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[#3B1E54] font-black text-xs uppercase tracking-widest">
            Total Users: {stats.totalUsers}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <CircularStat label="Active" value={stats.activeUsers} total={stats.totalUsers} color1="#38D7F8" color2="#6366F1" />
        <CircularStat label="Inactive" value={stats.inactiveUsers} total={stats.totalUsers} color1="#FF4B5C" color2="#EF4444" />
        <CircularStat label="Male" value={stats.maleUsers} total={stats.totalUsers} color1="#3B82F6" color2="#1E293B" />
        <CircularStat label="Female" value={stats.femaleUsers} total={stats.totalUsers} color1="#E879F9" color2="#EC4899" />
      </div>
    </div>
  );
};

export default AdminChart;