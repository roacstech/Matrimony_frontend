import React, { useState } from "react";
import { visibleConnections, handleConnectLogic } from "../../Data/UserDashboard";

const ConnectionCard = () => {
  const [activeTab, setActiveTab] = useState("Public");

  return (
    <div className="p-2 sm:p-4 bg-transparent space-y-10">
 
       
      {/* ================= TAB HEADER ================= */}
<div className="flex items-center gap-4">
  <button
    onClick={() => setActiveTab("Public")}
    className={`px-6 py-2 rounded-full text-[10px] font-extrabold tracking-[2px] uppercase transition-all ${
      activeTab === "Public"
        ? "bg-[#3B1E54] text-white shadow-lg"
        : "bg-[#EEEEEE] text-[#3B1E54]"
    }`}
  >
    🌍 Public
  </button>

  <button
    onClick={() => setActiveTab("Private")}
    className={`px-6 py-2 rounded-full text-[10px] font-extrabold tracking-[2px] uppercase transition-all ${
      activeTab === "Private"
        ? "bg-[#3B1E54] text-white shadow-lg"
        : "bg-[#EEEEEE] text-[#3B1E54]"
    }`}
  >
    🔒 Private
  </button>
</div>

 



      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto">
        {visibleConnections
          .filter((u) => u.visibility === activeTab)
          .map((u) => (
            <div
              key={u.id}
              className="group relative bg-white rounded-[32px] border border-[#EEEEEE] shadow-sm hover:shadow-2xl hover:border-[#D4BEE4] transition-all duration-500 flex flex-col w-full max-w-[310px] h-fit pt-12 pb-6 px-6 overflow-visible"
            >
              {/* FLOATING STATUS BADGE */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-md border border-white transition-transform group-hover:scale-105"
                style={{
                  backgroundColor:
                    u.visibility === "Public" ? "#D4BEE4" : "#EEEEEE",
                  color: "#3B1E54",
                }}
              >
                <span className="text-[11px] leading-none">
                  {u.visibility === "Public" ? "📡" : "🔐"}
                </span>
                <span className="text-[8.5px] font-extrabold uppercase tracking-[1px] whitespace-nowrap leading-none">
                  {u.visibility === "Public" ? "Public Mode" : "Private Mode"}
                </span>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-10 mt-2">
                <DetailItem icon="🌙" label="Raasi" value={u.raasi} />
                <DetailItem
                  icon={u.gender === "Male" ? "👨" : "👩"}
                  label="Gender"
                  value={u.gender}
                />
                <DetailItem icon="💰" label="Salary" value={u.salary} />
                <DetailItem
                  icon="💼"
                  label="Work"
                  value={u.work}
                  isAccent
                />
                <DetailItem icon="📍" label="Location" value={u.location} />
              </div>

              {/* ACTION */}
              <div className="mt-8 pt-5 border-t border-dashed border-[#D4BEE4]">
                <button
                  onClick={() => handleConnectLogic(u.id, u.work)}
                  className="w-full bg-[#3B1E54] text-white py-3.5 rounded-[20px] text-[9.5px] font-bold uppercase tracking-[2px] hover:bg-[#9B7EBD] transition-all transform active:scale-[0.94] shadow-lg hover:shadow-[#D4BEE4]"
                >
                  Connect Now
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// SUB COMPONENT – UNCHANGED
const DetailItem = ({ icon, label, value, isAccent }) => (
  <div className="flex flex-col min-w-0 w-full">
    <div className="flex items-center gap-1.5 mb-0.5">
      <span className="w-4 shrink-0 flex justify-center text-[15px] leading-none opacity-80">
        {icon}
      </span>
      <span className="text-[10px] text-[#9B7EBD] uppercase font-bold tracking-[0.12em] leading-none truncate">
        {label}
      </span>
    </div>

    <div className="ml-5 pr-1 min-h-[22px]">
      <span
        className={`text-[10px] font-bold leading-snug block line-clamp-2 ${
          isAccent ? "text-purple-600" : "text-green-500"
        }`}
        title={value}
      >
        {value}
      </span>
    </div>
  </div>
);

export default ConnectionCard;
