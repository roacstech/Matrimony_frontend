import React, { useEffect, useState } from "react";
import {
  getReceivedConnections,
  getSentConnections,
  acceptConnection,
  rejectConnection,
  withdrawConnection,
  getUserProfile,
  getAcceptedConnections,
} from "../../api/userApi";

const MyConnection = () => {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [acceptedReceived, setAcceptedReceived] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [toast, setToast] = useState({ show: false, msg: "" });
  const Img_Url = import.meta.env.VITE_IMG_URL;


  console.log("👌",sent);
  
  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  // ================= LOAD RECEIVED + SENT =================
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const receivedRes = await getReceivedConnections();
        const sentRes = await getSentConnections();

        setReceived(receivedRes.data || []);
        setSent(sentRes.data || []);
      } catch (err) {
        console.error("Failed to load connections", err);
      }
    };
    loadConnections();
  }, []);

  // ================= LOAD ACCEPTED =================
  const loadAcceptedConnections = async () => {
    try {
      const res = await getAcceptedConnections();
      if (res.success) {
        // ⭐ mark accepted
        const acceptedWithStatus = (res.data || []).map((c) => ({
          ...c,
          status: "Accepted",
        }));
        setAcceptedReceived(acceptedWithStatus);
      }
    } catch (err) {
      console.error("Failed to load accepted connections", err);
    }
  };

  useEffect(() => {
    loadAcceptedConnections();
  }, []);

  // ================= HELPERS =================
  const isExpired = (createdAt) => {
    const created = new Date(createdAt).getTime();
    return Date.now() - created >= 24 * 60 * 60 * 1000;
  };

  const hoursLeft = (createdAt) => {
    const diff =
      24 * 60 * 60 * 1000 - (Date.now() - new Date(createdAt).getTime());
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  };

  // ================= ACCEPT =================
  const handleAcceptConnection = async (connectionId) => {
    try {
      const res = await acceptConnection(connectionId);
      if (!res.success) {
        triggerToast(res.message || "Accept failed");
        return;
      }
      triggerToast("Connection accepted");
      await loadAcceptedConnections();
    } catch (err) {
      console.error(err);
      triggerToast("Something went wrong");
    }
  };

  // ================= REJECT =================
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
      console.error(err);
      triggerToast("Something went wrong");
    }
  };

  // ================= WITHDRAW =================
  const handleWithdrawRequest = async (connectionId) => {
    console.log("withdraw id", connectionId);

    await withdrawConnection(connectionId);
    setSent((prev) => prev.filter((c) => c.connectionId !== connectionId));
    triggerToast(`Request withdrawn from ${connectionId}`);
  };

  // ================= VIEW PROFILE =================
  const handleViewProfile = async (userId) => {
    try {
      const res = await getUserProfile(userId);
      if (res.success) setSelectedUser(res.data);
      else triggerToast(res.message || "Profile not found");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to load profile");
    }
  };

  // ⭐ merge pending + accepted
  const allReceived = [...received, ...acceptedReceived];

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
            {allReceived.map((c) => {
              const expired = isExpired(c.created_at);
              const isAccepted = c.status === "Accepted";

              return (
                <div
                  key={c.connectionId}
                  onClick={() => {
                    if (isAccepted) {
                      handleViewProfile(c.user_id || c.from_user);
                    }
                  }}
                  className={`bg-white rounded-[32px] p-6 border-l-[10px] cursor-pointer transition
                    ${
                      isAccepted
                        ? "border-l-green-600 bg-green-50"
                        : expired
                        ? "opacity-50 border-l-gray-400"
                        : "border-l-[#3B1E54]"
                    }`}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-black text-[#3B1E54]">
                      {c.full_name || "User"}
                    </h3>

                    {isAccepted && (
                      <span className="text-[10px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                        ✓ Accepted
                      </span>
                    )}

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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptConnection(c.connectionId);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-full text-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectConnection(c.connectionId);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-full text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {allReceived.length === 0 && (
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
                  <p className="font-bold text-sm">{c.receiver_work}</p>
                  <p className="text-xs text-gray-500">
                    {c.receiver_city} • {c.receiver_raasi} • {c.receiver_salary}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleWithdrawRequest(c.connectionId)
                  }
                  className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {/* ================= PROFILE MODAL ================= */}
{selectedUser && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">

      {/* CLOSE */}
      <button
        onClick={() => setSelectedUser(null)}
        className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded-full"
      >
        ✕
      </button>

      {/* HEADER */}
      <div className="text-center mb-6">
        <img
          src={`${Img_Url}/photos/${selectedUser.photo}`}
          className="w-28 h-28 object-cover rounded-2xl mx-auto mb-3"
        />
        <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
        <p className="text-gray-500">
          {selectedUser.city}, {selectedUser.country}
        </p>
      </div>

      {/* PERSONAL INFO */}
      <Section title="Personal Information">
        <Row label="Gender" value={selectedUser.gender} />
        <Row label="Date of Birth" value={selectedUser.dob?.split("T")[0]} />
        <Row label="Birth Time" value={selectedUser.birth_time} />
        <Row label="Birth Place" value={selectedUser.birth_place} />
        <Row label="Marital Status" value={selectedUser.marital_status} />
      </Section>

      {/* EDUCATION & CAREER */}
      <Section title="Education & Career">
        <Row label="Education" value={selectedUser.education} />
        <Row label="Occupation" value={selectedUser.occupation} />
        <Row label="Income" value={selectedUser.income} />
      </Section>

      {/* FAMILY */}
      <Section title="Family Details">
        <Row label="Father" value={selectedUser.father_name} />
        <Row label="Mother" value={selectedUser.mother_name} />
        <Row label="Grandfather" value={selectedUser.grandfather_name} />
        <Row label="Grandmother" value={selectedUser.grandmother_name} />
        <Row label="Siblings" value={selectedUser.siblings} />
      </Section>

      {/* ASTROLOGY */}
      <Section title="Astrology">
        <Row label="Raasi" value={selectedUser.raasi} />
        <Row label="Star" value={selectedUser.star} />
        <Row label="Dosham" value={selectedUser.dosham} />
      </Section>

      {/* RELIGION */}
      <Section title="Religion & Community">
        <Row label="Religion" value={selectedUser.religion} />
        <Row label="Caste" value={selectedUser.caste} />
      </Section>

      {/* ADDRESS */}
      <Section title="Address">
        <Row label="Address" value={selectedUser.address} />
        <Row label="City" value={selectedUser.city} />
        <Row label="Country" value={selectedUser.country} />
      </Section>

      {/* HOROSCOPE */}
      <Section title="Horoscope">
        {selectedUser.horoscope_uploaded ? (
          <a
            href={`${Img_Url}${selectedUser.horoscope_file_url}`}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Horoscope File
          </a>
        ) : (
          <p className="text-gray-400">Not uploaded</p>
        )}
      </Section>

    </div>
  </div>
)}

    </div>
  );
};


const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-bold text-lg mb-3 border-b pb-1">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value || "-"}</span>
  </div>
);


export default MyConnection;


