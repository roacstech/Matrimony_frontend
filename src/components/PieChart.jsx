// src/components/PieChart.js
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { getAllUsers } from "../api/adminApi";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const [privacyCounts, setPrivacyCounts] = useState({ private: 0, public: 0 });

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        // Count private vs public
        let privateCount = 0;
        let publicCount = 0;

        res.forEach((u) => {
          if (u.privacy === "Private") privateCount++;
          if (u.privacy === "Public") publicCount++;
        });

        setPrivacyCounts({ private: privateCount, public: publicCount });
      })
      .catch(console.error);
  }, []);

  const chartData = {
    labels: ["Private Profiles", "Public Profiles"],
    datasets: [
      {
        label: "Privacy Distribution",
        data: [privacyCounts.private, privacyCounts.public],
        backgroundColor: ["#1A5AF0", "#111827"], // Blue & Black palette
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Profiles Privacy Status",
      },
    },
  };

  return (
    <div className="w-[250px] h-[250px] mx-auto">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PieChart;