import React, { useState } from "react";
import {
  connections as initialConnections,
  getUserById,
} from "../../Data/Connections";

const MyConnection = () => {
  const [connectionsData, setConnectionsData] = useState(initialConnections);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const meId = 1;

  const [toast, setToast] = useState({ show: false, msg: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const received = connectionsData.filter(
    (c) => c.to === meId && c.status !== "Sent"
  );
  const sent = connectionsData.filter((c) => c.from === meId);

  const isExpired = (createdAt) => {
    const created = new Date(createdAt).getTime();
    return Date.now() - created >= 24 * 60 * 60 * 1000;
  };

  const hoursLeft = (createdAt) => {
    const created = new Date(createdAt).getTime();
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - created);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  };

  const handleAcceptConnection = (id, name) => {
    setConnectionsData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Accepted" } : c))
    );
    triggerToast(`Connection accepted with ${name}`);
  };

  const handleRejectConnection = (id, name) => {
    setConnectionsData((prev) => prev.filter((c) => c.id !== id));
    triggerToast(`Connection rejected from ${name}`);
  };

  const handleWithdrawRequest = (id, name) => {
    setConnectionsData((prev) => prev.filter((c) => c.id !== id));
    triggerToast(`Request withdrawn from ${name}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto min-h-screen bg-[#FBFBFE] relative">
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3B1E54] text-white px-6 py-3 rounded-2xl shadow-xl text-xs font-bold tracking-widest uppercase">
          ✨ {toast.msg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ================= RECEIVED ================= */}
        <section className="w-full lg:w-[55%] space-y-6">
          <div className="flex justify-between items-center border-b-2 border-[#D4BEE4] pb-2">
            <h2 className="text-[18px] font-black text-[#3B1E54] uppercase">
              Received Connections
            </h2>
            <span className="text-[10px] font-bold text-[#9B7EBD]">
              REPLY PENDING
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {received.map((c) => {
              const user = getUserById(c.from);
              if (!user) return null;

              const expired = isExpired(c.createdAt);
              const isAccepted = c.status === "Accepted";

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (expired) return;
                    if (!isAccepted) {
                      triggerToast("Accept the request to view full profile");
                      return;
                    }
                    setSelectedUserId(
                      selectedUserId === user.id ? null : user.id
                    );
                  }}
                  className={`bg-white rounded-[32px] p-6 flex gap-6 border border-[#EEEEEE] border-l-[10px]
                    ${
                      expired
                        ? "opacity-50 cursor-not-allowed border-l-gray-400"
                        : "cursor-pointer border-l-[#3B1E54] hover:shadow-xl"
                    } transition-all`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-end">
                      {expired ? (
                        <span className="text-[10px] font-bold text-red-500">
                          ⛔ Expired
                        </span>
                      ) : isAccepted ? (
                        <span className="text-[10px] font-bold text-blue-600">
                          ✅ Connected
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-green-600">
                          ⏳ {hoursLeft(c.createdAt)} hrs left
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t border-dashed">
                      <p className="text-[10px] font-bold text-[#3B1E54] uppercase">
                        🔯 Raasi: {user.raasi}
                      </p>
                      <p className="text-[10px] font-bold text-[#3B1E54] uppercase">
                        👤 Gender: {user.gender}
                      </p>
                      <p className="text-[10px] font-bold text-[#3B1E54] uppercase">
                        💰 Salary: {user.income}
                      </p>
                      <p className="text-[10px] font-bold text-[#3B1E54] uppercase truncate">
                        💼 Work: {user.occupation}
                      </p>
                      <p className="text-[10px] font-bold text-[#3B1E54] uppercase col-span-2">
                        📍 Location: {user.city}
                      </p>
                    </div>

                    {!expired && !isAccepted && (
<div className="flex gap-3 mt-4">
  {/* Accept Button - Modern Pill Shape */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAcceptConnection(c.id, user.fullName);
    }}
    className=" bg-[#8BAE66] text-white py-2 px-6 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-[#00E676] transition-all duration-200 shadow-sm active:scale-95"
  >
    Accept
  </button>

  {/* Reject Button - Modern Pill Shape */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleRejectConnection(c.id, user.fullName);
    }}
    className=" bg-[#FF937E] text-white py-2 px-6 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-[#FF5252] transition-all duration-200 shadow-sm active:scale-95"
  >
    Reject
  </button>
</div>

                    )}

                    {selectedUserId === user.id && isAccepted && (
                      <div className="mt-6 bg-[#F9F7FC] rounded-[24px] p-6 border border-[#D4BEE4]">
                        <h4 className="text-[15px] font-black text-[#3B1E54] mb-4">
                          Full Profile Details
                        </h4>
<div className="flex items-center gap-4 mb-8 bg-transparent">
  {/* Profile Avatar */}
  <div className="shrink-0 w-16 h-16 rounded-full bg-[#F3F0F7] border-2 border-[#D4BEE4] overflow-hidden flex items-center justify-center shadow-sm">
    {user.photo ? (
      <img src={user.photo} alt={user.fullName} className="w-full h-full object-cover" />
    ) : (
      <span className="text-xl font-black text-[#3B1E54]">
        {user.fullName?.charAt(0)}
      </span>
    )}
  </div>

  {/* User Content */}
  <div className="flex flex-col justify-center">
    <div className="flex items-center gap-2 mb-1">
      <h3 className="text-[17px] font-black text-[#3B1E54] tracking-tight">
        {user.fullName}
      </h3>
      
      {/* Small Minimal Privacy Badge */}
      <div
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border
          ${
            user.privacy === "Public"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100"
          }`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            user.privacy === "Public" ? "bg-emerald-400" : "bg-rose-400"
          }`}></span>
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            user.privacy === "Public" ? "bg-emerald-500" : "bg-rose-500"
          }`}></span>
        </span>
        {user.privacy}
      </div>
    </div>

    {/* Location Info */}
    <p className="flex items-center gap-1 text-[11px] font-bold text-[#9B7EBD] uppercase tracking-wider opacity-90">
      <span>📍</span> {user.city}, {user.country}
    </p>
              <p className="flex items-center gap-1 text-[10px] font-bold text-[#3B1E54] lowercase opacity-80 mt-0.5">
    <span>📧</span> {user.email || `${user.fullName?.toLowerCase()}@gmail.com`}
  </p>
  </div>
</div>


<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px] font-bold text-[#3B1E54]">
  <p>👤 Gender: {user.gender}</p>
  <p>🎂 DOB: {user.dob}</p>
  <p>⏰ Birth Time: {user.birthTime}</p>
  <p>💍 Marital Status: {user.maritalStatus}</p>

  <p>🎓 Education: {user.education}</p>

  <p>💰 Income: {user.income}</p>

  <p>🧑 Father: {user.father}</p>
  <p>👩 Mother: {user.mother}</p>
  <p>👴 Grandfather: {user.grandfather}</p>
  <p>👵 Grandmother: {user.grandmother}</p>

  <p>🔯 Raasi: {user.raasi}</p>
  <p>⭐ Star: {user.star}</p>
  <p>⚠️ Dosham: {user.dosham}</p>

  <p>🛕 Religion: {user.religion}</p>
  <p>🧬 Caste: {user.caste}</p>
  <p className="flex gap-1 items-start">
  <span className="shrink-0">💼 Occupation:</span>
  <span className="break-words">
    {user.occupation}
  </span>
</p>

<p className="flex gap-1 items-start col-span-2">
  <span className="shrink-0">📍 Address:</span>
  <span className="break-words">{user.address}</span>
</p>


  <p className="col-span-2 md:col-span-3">
    📜 Jadhagam:
    {user.horoscope?.uploaded ? (
      <a
        href={`/${user.horoscope.fileUrl.replace(/^\/?/, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-blue-600 underline font-bold"
        onClick={(e) => e.stopPropagation()}
      >
        View ({user.horoscope.fileName})
      </a>
    ) : (
      <span className="ml-2 text-gray-400">Not Uploaded</span>
    )}
  </p>
</div>


                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SENT ================= */}
<section className="w-full lg:w-[45%] space-y-6 bg-white/60 p-6 md:p-8 rounded-[40px] border shadow-inner">
  <div className="flex justify-between items-center border-b border-[#3B1E54]/10 pb-3">
    <div className="flex items-center gap-2">
      <h2 className="text-[15px] font-black text-[#3B1E54]/80 uppercase tracking-tight">
        Sent Requests
      </h2>
      <span className="bg-[#3B1E54]/10 text-[#3B1E54] text-[10px] px-2 py-0.5 rounded-full font-bold">
        {sent.length}
      </span>
    </div>
    <button
      onClick={() => {
        setConnectionsData((prev) => prev.filter((c) => c.from !== meId));
        triggerToast("All sent requests cleared");
      }}
      className="text-[10px] font-bold  uppercase hover:  bg-[#FF937E] text-white py-2 px-6 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-[#FF5252] transition-all duration-200 shadow-sm active:scale-95"
  
    >
      Clear All
    </button>
  </div>

  <div className="flex flex-col gap-2">
    {sent.map((c) => {
      const user = getUserById(c.to);
      if (!user) return null;

      return (
        <div
          key={c.id}
          className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#3B1E54]/20 transition-all duration-200"
        >
          {/* Main Content Row */}
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Gender Badge */}
              <span className="text-[9px] font-black text-[#3B1E54] bg-[#F3F0F7] px-2 py-0.5 rounded-md uppercase border border-[#D4BEE4]/30">
                {user.gender}
              </span>

              {/* Salary - Clearly Highlighted */}
              <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 bg-[#F3FEB8] px-2 py-0.5 rounded-md border border-emerald-100">
                💰 {user.income || "Not Specified"} 
              </span>

              {/* Other Details */}
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                💼 {user.occupation}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                📍 {user.city}
              </span>
    
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWithdrawRequest(c.id, user.fullName || "User");
            }}
            className="shrink-0 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      );
    })}

    {sent.length === 0 && (
      <p className="text-center py-10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        No pending requests
      </p>
    )}
  </div>
</section>
      </div>
    </div>
  );
};

export default MyConnection;


