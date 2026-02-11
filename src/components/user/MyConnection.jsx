;


import React, { useEffect, useState } from "react";
import {
  getReceivedConnections,
  getSentConnections,
  acceptConnection,
  rejectConnection,
  withdrawConnection,
} from "../../api/userApi";

const MyConnection = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  const [toast, setToast] = useState({ show: false, msg: "" });

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  // 🔥 LOAD DATA FROM BACKEND
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const receivedRes = await getReceivedConnections();
        const sentRes = await getSentConnections();

        // ✅ correct
setReceived(receivedRes.data.data || []);
        setSent(sentRes.data.data || []);
      } catch (err) {
        console.error("Failed to load connections", err);
      }
    };

    loadConnections();
  }, []);

  // 🔥 HELPERS
  const isExpired = (createdAt) => {
    const created = new Date(createdAt).getTime();
    return Date.now() - created >= 24 * 60 * 60 * 1000;
  };

  const hoursLeft = (createdAt) => {
    const diff =
      24 * 60 * 60 * 1000 - (Date.now() - new Date(createdAt).getTime());
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  };

  // 🔥 ACTION HANDLERS
const handleAcceptConnection = async (connectionId) => {
  try {
    const res = await acceptConnection(connectionId);
    const data = res.data;

    if (!data.success) {
      triggerToast(data.message || "Accept failed");
      return;
    }

    setReceived((prev) =>
      prev.map((c) =>
        c.connectionId === connectionId
          ? { ...c, status: "Accepted" }
          : c
      )
    );

    triggerToast("Connection accepted");
  } catch (err) {
    triggerToast("Something went wrong");
    console.error("Accept connection error:", err);
  }
};



/// User Rejct connections


const handleRejectConnection = async (connectionId) => {
  try {
    const data = await rejectConnection(connectionId);

    if (!data.success) {
      triggerToast(data.message || "Reject failed");
      return;
    }

    setReceived((prev) =>
      prev.filter((c) => c.connectionId !== connectionId)
    );

    triggerToast("Connection rejected");
  } catch (err) {
    console.error("Reject connection error:", err);
    triggerToast("Something went wrong");
  }
};




  const handleWithdrawRequest = async (connectionId, name) => {
    await withdrawConnection(connectionId);
    setSent((prev) =>
      prev.filter((c) => c.connectionId !== connectionId)
    );
    triggerToast(`Request withdrawn from ${name}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto min-h-screen bg-[#FBFBFE] relative">
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3B1E54] text-white px-6 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase">
          ✨ {toast.msg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ================= RECEIVED ================= */}
        <section className="w-full lg:w-[55%] space-y-6">
          <h2 className="text-[18px] font-black text-[#3B1E54] uppercase">
            Received Connections
          </h2>

          <div className="grid grid-cols-1 gap-5">
            {received.map((c) => {
              const expired = isExpired(c.created_at);
              const isAccepted = c.status === "Accepted";

              return (
                <div
                  key={c.connectionId}
                  className={`bg-white rounded-[32px] p-6 border-l-[10px]
                    ${
                      expired
                        ? "opacity-50 border-l-gray-400"
                        : "border-l-[#3B1E54]"
                    }`}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-black text-[#3B1E54]">
                      {c.full_name || "User"}
                    </h3>
                    {!expired && !isAccepted && (
                      <span className="text-[10px] text-green-600 font-bold">
                        ⏳ {hoursLeft(c.created_at)} hrs left
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600">
                    {c.gender} • {c.occupation} • {c.city}
                  </p>

                  {!expired && !isAccepted && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() =>
                          handleAcceptConnection(
                            c.connectionId,
                            c.fullName
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-full text-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRejectConnection(
                            c.connectionId,
                            c.full_name
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-xs reject-btn"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {received.length === 0 && (
              <p className="text-center text-gray-400 text-xs">
                No received requests
              </p>
            )}
          </div>
        </section>

        {/* ================= SENT ================= */}
        <section className="w-full lg:w-[45%] space-y-6 bg-white/60 p-6 rounded-[40px]">
          <h2 className="text-[15px] font-black text-[#3B1E54]/80 uppercase">
            Sent Requests ({sent.length})
          </h2>

          <div className="flex flex-col gap-3">
            {sent.map((c) => (
              <div
                key={c.connectionId}
                className="flex justify-between items-center bg-white p-4 rounded-2xl border"
              >
                <div>
                  <p className="font-bold text-sm">{c.full_name}</p>
                  <p className="text-xs text-gray-500">
                    {c.gender} • {c.occupation} • {c.city}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleWithdrawRequest(c.connectionId, c.fullName)
                  }
                  className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            ))}

            {sent.length === 0 && (
              <p className="text-center text-gray-400 text-xs">
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

