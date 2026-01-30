import React, { useState } from "react";
import { connections as initialConnections, getUserById } from "../../Data/Connections";

const MyConnection = () => {
  // Use state to make the buttons actually update the UI
  const [connectionsData, setConnectionsData] = useState(initialConnections);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const meId = 1;

  const [toast, setToast] = useState({ show: false, msg: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  // Filter based on the state variable
  const received = connectionsData.filter((c) => c.to === meId && c.status !== "Sent");
  const sent = connectionsData.filter((c) => c.from === meId);

  // ================= EXPIRY HELPERS =================
  const isExpired = (createdAt) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    return now - created >= 24 * 60 * 60 * 1000;
  };

  const hoursLeft = (createdAt) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diff = 24 * 60 * 60 * 1000 - (now - created);
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  };

  // Handle accepting a connection request
  const handleAcceptConnection = (connectionId, userName) => {
    setConnectionsData(prev => 
      prev.map(c => c.id === connectionId ? { ...c, status: "Accepted" } : c)
    );
    triggerToast(`Connection accepted with ${userName}`);
  };

  // Handle rejecting/ignoring a connection request
  const handleRejectConnection = (connectionId, userName) => {
    setConnectionsData(prev => prev.filter(c => c.id !== connectionId));
    triggerToast(`Connection rejected from ${userName}`);
  };

  // Handle withdrawing a sent connection request
  const handleWithdrawRequest = (connectionId, userName) => {
    setConnectionsData(prev => prev.filter(c => c.id !== connectionId));
    triggerToast(`Request withdrawn from ${userName}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto min-h-screen bg-[#FBFBFE] relative">
      {/* TOAST */}
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
                    // Only allow opening details if accepted
                    if (!isAccepted) {
                      triggerToast("Accept the request to view full profile");
                      return;
                    }

                    if (selectedUserId === user.id) {
                      setSelectedUserId(null);
                    } else {
                      setSelectedUserId(user.id);
                      triggerToast(`Opening ${user.fullName}`);
                    }
                  }}
                  className={`bg-white rounded-[32px] p-6 flex gap-6
                    border border-[#EEEEEE] border-l-[10px]
                    ${
                      expired
                        ? "opacity-50 cursor-not-allowed border-l-gray-400"
                        : "cursor-pointer border-l-[#3B1E54] hover:shadow-xl"
                    }
                    transition-all`}
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-[24px] bg-[#F3F0F7] border-2 border-[#D4BEE4]
                                  flex items-center justify-center overflow-hidden">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-[#3B1E54]">
                        {user.fullName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-[17px] font-black text-[#3B1E54]">
                          {user.fullName}
                        </h3>
                        <p className="text-[11px] font-bold text-[#9B7EBD] uppercase">
                          📍 {user.city || "Chennai"}, India
                        </p>
                      </div>

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
                      <div className="text-[10px] font-bold text-[#3B1E54] uppercase">
                        🎓 {user.education || "Professional"}
                      </div>
                      <div className="text-[10px] font-bold text-[#3B1E54] uppercase truncate">
                        💼 {user.occupation || "Software Field"}
                      </div>
                    </div>

                    {/* Action buttons - Hidden if already accepted or expired */}
                    {!expired && !isAccepted && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptConnection(c.id, user.fullName);
                          }}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl text-xs font-bold uppercase hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectConnection(c.id, user.fullName);
                          }}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl text-xs font-bold uppercase hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* FULL DETAILS - ONLY SHOW IF ACCEPTED */}
                    {selectedUserId === user.id && isAccepted && (
                      <div className="mt-6 bg-[#F9F7FC] rounded-[24px] p-6 border border-[#D4BEE4]">
                        <h4 className="text-[15px] font-black text-[#3B1E54] mb-4">
                          Full Profile Details
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[11px] font-bold text-[#3B1E54]">
                          <p>👤 Gender: {user.gender}</p>
                          <p>🎂 DOB: {user.dob}</p>
                          <p>⏰ Birth Time: {user.birthTime}</p>
                          <p>💍 Marital Status: {user.maritalStatus}</p>

                          <p>🎓 Education: {user.education}</p>
                          <p>💼 Occupation: {user.occupation}</p>
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

                          <p>📍 Address: {user.address}</p>
                          <p>🏙 City: {user.city}</p>
                          <p>🌍 Country: {user.country}</p>

                          <p>🔒 Account: {user.privacy}</p>
                          <p className="col-span-2 md:col-span-3">
                            📜 Jadhagam:
                            {user.horoscope?.uploaded ? (
                              <a
                                href={user.horoscope.fileUrl}
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
        <section className="w-full lg:w-[45%] space-y-6 bg-white/60 p-8 rounded-[40px] border shadow-inner">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-[16px] font-black text-[#3B1E54]/70 uppercase">
              Sent Requests
            </h2>
            <button
              onClick={() => {
                setConnectionsData(prev => prev.filter(c => c.from !== meId));
                triggerToast("All sent requests cleared");
              }}
              className="text-[10px] font-bold text-red-500 uppercase"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sent.map((c) => {
              const user = getUserById(c.to);
              if (!user) return null;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-[28px] p-6 text-center border shadow-sm"
                >
                  {/* <div className="w-14 h-14 mx-auto mb-3 rounded-full
                                  bg-gradient-to-tr from-[#3B1E54] to-[#9B7EBD] p-1">
                    {/* <div className="w-full h-full bg-white rounded-full
                                    flex items-center justify-center font-black text-[#3B1E54]">
                      {user.fullName.charAt(0)}
                    </div> */}
                  {/* </div> */} 

                  <p className="text-[11px] font-bold text-[#3B1E54] uppercase">
                    💼 {user.occupation || "N/A"}
                  </p>

                  <p className="text-[11px] font-bold text-[#3B1E54] uppercase">
                    🔯 {user.raasi || "N/A"}
                  </p>

                  <p className="text-[11px] font-bold text-[#3B1E54] uppercase">
                    📍 {user.city || "N/A"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWithdrawRequest(c.id, user.fullName);
                    }}
                    className="mt-3 text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                  >
                    Cancel Request
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyConnection;