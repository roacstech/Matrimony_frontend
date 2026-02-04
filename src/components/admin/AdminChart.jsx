import React from "react";

/* ================= CIRCULAR STAT COMPONENT ================= */
const CircularStat = ({ label, value, total, color1, color2 }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percentage) / 100;

  return (
    // Border updated to #EEEEEE
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-[28px] shadow-sm border border-[#EEEEEE] hover:shadow-md transition-all group">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#FAF6F3" // Background circle in Cream
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
            strokeDashoffset={circumference}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-[1500ms] ease-out"
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
          {/* Main Text: #5D4037 */}
          <span className="text-xl sm:text-2xl font-black text-[#5D4037]">
            {value}
          </span>
          {/* Percentage: #A67C52 */}
          <span className="text-[9px] sm:text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Label: Group hover transitions to Brown */}
      <h4 className="mt-3 sm:mt-4 text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest text-center group-hover:text-[#5D4037] transition-colors">
        {label}
      </h4>

      <style jsx>{`
        @keyframes spin-load {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: var(--target-offset); }
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
    // Section Background: Cream #FAF6F3
    <div className="bg-[#FAF6F3]/50 p-4 sm:p-6 md:p-8 rounded-[40px] animate-fade-in border border-[#EEEEEE]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          {/* Heading: #5D4037 */}
          <h3 className="text-2xl sm:text-3xl font-black text-[#5D4037] tracking-tight">
            System Insights
          </h3>
          {/* Subheading: #A67C52 */}
          <p className="text-[#A67C52] text-[10px] font-bold uppercase tracking-[3px] mt-1">
            Real-time user distribution
          </p>
        </div>

        {/* Total Badge: Uses #5D4037 */}
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-2 h-2 bg-[#A67C52] rounded-full animate-pulse"></div>
          <span className="text-[#5D4037] font-black text-xs uppercase tracking-widest">
            Total Users: {stats.totalUsers}
          </span>
        </div>
      </div>

      {/* Circular Stats with Earth-tone Gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Active: Brown Gradient */}
        <CircularStat label="Active" value={stats.activeUsers} total={stats.totalUsers} color1="#5D4037" color2="#8D6E63" />
        
        {/* Inactive: Grey/Taupe Gradient */}
        <CircularStat label="Inactive" value={stats.inactiveUsers} total={stats.totalUsers} color1="#9E9E9E" color2="#EEEEEE" />
        
        {/* Male: Golden Gradient */}
        <CircularStat label="Male" value={stats.maleUsers} total={stats.totalUsers} color1="#A67C52" color2="#D7CCC8" />
        
        {/* Female: Soft Tan Gradient */}
        <CircularStat label="Female" value={stats.femaleUsers} total={stats.totalUsers} color1="#D4A373" color2="#FAEDCD" />
      </div>
    </div>
  );
};

export default AdminChart;