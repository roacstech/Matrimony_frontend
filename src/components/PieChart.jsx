// src/components/PieChart.js
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getAllUsers } from "../api/adminApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [privacyCounts, setPrivacyCounts] = useState({ private: 0, public: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        let privateCount = 0;
        let publicCount = 0;
        res.forEach((u) => {
          if (u.privacy === "Private") privateCount++;
          if (u.privacy === "Public") publicCount++;
        });
        setPrivacyCounts({ private: privateCount, public: publicCount });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = privacyCounts.private + privacyCounts.public;
  const privatePercent = total > 0 ? Math.round((privacyCounts.private / total) * 100) : 0;
  const publicPercent  = total > 0 ? Math.round((privacyCounts.public  / total) * 100) : 0;

  const chartData = {
    labels: ["Private", "Public"],
    datasets: [
      {
        data: [privacyCounts.private, privacyCounts.public],
        backgroundColor: ["#1E40AF", "#E0F2FE"],
        borderColor: ["#1E40AF", "#BAE6FD"],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",           // donut style
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} users`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">

      {/* Left — title + legend */}
      <div className="flex-1 min-w-[180px]">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Distribution
        </p>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Profile Privacy Status
        </h3>

        {/* Legend items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#1E40AF] inline-block" />
              <span className="text-sm text-gray-600">Private Profiles</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-800">
                {privacyCounts.private}
              </span>
              <span className="text-xs text-gray-400 ml-1">({privatePercent}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] inline-block" />
              <span className="text-sm text-gray-600">Public Profiles</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-800">
                {privacyCounts.public}
              </span>
              <span className="text-xs text-gray-400 ml-1">({publicPercent}%)</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Users</span>
            <span className="text-sm font-semibold text-gray-800">{total}</span>
          </div>
        </div>
      </div>

      {/* Right — donut chart */}
      <div className="relative w-[220px] h-[220px] shrink-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <Pie data={chartData} options={chartOptions} />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">{total}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default PieChart;