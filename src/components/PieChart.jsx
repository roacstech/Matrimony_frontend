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
        backgroundColor: ["#1D4ED8", "#BAE6FD"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
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
    <div className="flex flex-col md:flex-row items-center gap-10">

      {/* Left — title + legend */}
      <div className="flex-1 min-w-[200px]">
        <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-widest mb-1">
          Distribution
        </p>
        <h3 className="text-xl font-bold text-gray-700 mb-6">
          Profile Privacy Status
        </h3>

        <div className="space-y-3">
          {/* Private */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700 shrink-0" />
              <span className="text-sm font-medium text-gray-600">Private Profiles</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-blue-700">
                {privacyCounts.private}
              </span>
              <span className="text-xs text-gray-400">({privatePercent}%)</span>
            </div>
          </div>

          {/* Public */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/60 border border-sky-100">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
              <span className="text-sm font-medium text-gray-600">Public Profiles</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-sky-500">
                {privacyCounts.public}
              </span>
              <span className="text-xs text-gray-400">({publicPercent}%)</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 px-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Total Users
            </span>
            <span className="text-base font-bold text-gray-700">{total}</span>
          </div>
        </div>
      </div>

      {/* Right — donut */}
      <div className="relative w-[210px] h-[210px] shrink-0">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-700">{total}</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                Total
              </span>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default PieChart;