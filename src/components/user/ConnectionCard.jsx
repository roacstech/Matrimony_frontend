import React, { useState } from "react";
import {
  visibleConnections,
  handleConnectLogic,
  getUserById,
} from "../../Data/UserDashboard";

const ConnectionCard = () => {
  console.log("✅ ConnectionCard rendered")
  const [activeTab, setActiveTab] = useState("Public");
  const [selectedUser, setSelectedUser] = useState(null); // 👁 view state

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
              {/* 👁 EYE ICON – PUBLIC PROFILE ONLY */}
              {u.visibility === "Public" && (
                <button
                  onClick={() => setSelectedUser(getUserById(u.id))}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md
                             hover:bg-[#3B1E54] hover:text-white transition"
                >
                  👁
                </button>
              )}

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
                  {u.visibility === "Public"
                    ? "Public Mode"
                    : "Private Mode"}
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

      {/* ================= VIEW USER POPUP ================= */}
 {selectedUser && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    {/* Width increased to 600px for a better two-column feel */}
    <div className="bg-white rounded-3xl p-6 w-full max-w-[600px] relative max-h-[90vh] overflow-y-auto shadow-2xl">
      
      {/* CLOSE BUTTON */}
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-4 right-4 text-xl hover:scale-110 transition-transform"
      >
        ❌
      </button>

      {/* HEADER SECTION */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={selectedUser.photo || "https://i.pravatar.cc/300"}
          alt=""
          className="w-24 h-24 rounded-full shadow-md mb-3 border-2 border-gray-100"
        />
        <h3 className="text-center font-black text-xl text-gray-800">
          {selectedUser.fullName}
        </h3>
        <p className="text-center text-sm text-[#3B1E54] font-semibold">
          {selectedUser.occupation}
        </p>
        <p className="text-center text-xs text-gray-400 mt-1 uppercase tracking-wider">
          📍 {selectedUser.city}, {selectedUser.country}
        </p>
      </div>

      <hr className="mb-6" />

      {/* TWO COLUMN DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-xs">
        
        {/* Left Column: Personal & Education */}
        <div className="space-y-2">
          <p className="flex justify-between"><b>Gender:</b> <span>{selectedUser.gender}</span></p>
          <p className="flex justify-between"><b>DOB:</b> <span>{selectedUser.dob}</span></p>
          <p className="flex justify-between"><b>Birth Time:</b> <span>{selectedUser.birthTime}</span></p>
          <p className="flex justify-between"><b>Marital Status:</b> <span>{selectedUser.maritalStatus}</span></p>
          <div className="pt-2 border-t border-gray-50 mt-2">
            <p className="flex flex-col gap-1"><b>Education:</b> <span className="text-gray-600">{selectedUser.education}</span></p>
            <p className="flex justify-between mt-2"><b>Income:</b> <span className="text-green-600 font-bold">{selectedUser.income}</span></p>
          </div>
        </div>

        {/* Right Column: Family & Astrology */}
        <div className="space-y-2">
          <p className="flex justify-between"><b>Father:</b> <span>{selectedUser.father}</span></p>
          <p className="flex justify-between"><b>Mother:</b> <span>{selectedUser.mother}</span></p>
          <p className="flex justify-between"><b>Grandfather:</b> <span>{selectedUser.grandfather}</span></p>
          <p className="flex justify-between"><b>Grandmother:</b> <span>{selectedUser.grandmother}</span></p>
          <p className="flex justify-between"><b>Siblings:</b> <span>{selectedUser.siblings}</span></p>
          
          <div className="pt-2 border-t border-gray-50 mt-2">
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg">
              <p className="flex flex-col"><b>Raasi:</b> {selectedUser.raasi}</p>
              <p className="flex flex-col"><b>Star:</b> {selectedUser.star}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH SECTIONS */}
      <div className="mt-6 text-xs space-y-4">
        <hr />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <p><b>Email:</b> <span className="text-blue-600">{selectedUser.email}</span></p>
           <p><b>Birth Place:</b> {selectedUser.birthPlace}</p>
        </div>
        
        <p className="bg-slate-50 p-3 rounded-xl leading-relaxed">
          <b>Address:</b> {selectedUser.address}, {selectedUser.city}, {selectedUser.country}
        </p>

        {/* JADHAGAM / HOROSCOPE */}
        <div className="mt-6">
          {selectedUser.horoscope?.uploaded ? (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-800">📜 Jadhagam</p>
                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                  {selectedUser.horoscope.fileName || "Horoscope File"}
                </p>
              </div>

              <a
                href={`/${selectedUser.horoscope.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 text-[10px] bg-[#3B1E54] text-white rounded-xl font-bold hover:bg-[#2a153d] transition-colors shadow-sm"
              >
                View / Download
              </a>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400 py-4 bg-gray-50 rounded-xl border-2 border-dashed">
              📜 Jadhagam not uploaded
            </p>
          )}
        </div>
      </div>

    </div>
  </div>
)}
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
