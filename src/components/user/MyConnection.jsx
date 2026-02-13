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

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  /* ================= LOAD CONNECTIONS ================= */
useEffect(() => {
  const loadConnections = async () => {
    try {
      const receivedRes = await getReceivedConnections();
      const sentRes = await getSentConnections();

      console.log("😊 received:", receivedRes);
      console.log("👉 sent:", sentRes);

      if (receivedRes?.success && Array.isArray(receivedRes.data)) {
        setReceived(receivedRes.data);
      }

      if (sentRes?.success && Array.isArray(sentRes.data)) {
        setSent(sentRes.data);
      }
    } catch (err) {
      console.error("Failed to load connections", err);
    }
  };

  loadConnections();
}, []);




  /* ================= LOAD ACCEPTED ================= */
  useEffect(() => {
    const loadAcceptedConnections = async () => {
      try {
        const res = await getAcceptedConnections();
        if (res?.success) {
          const accepted = (res.data || []).map((c) => ({ ...c, status: "Accepted" }));
          setAcceptedReceived(accepted);
        }
      } catch (err) {
        console.error("Failed to load accepted connections", err);
      }
    };
    loadAcceptedConnections();
  }, []);

  const isExpired = (createdAt) => Date.now() - new Date(createdAt).getTime() >= 24 * 60 * 60 * 1000;

  const hoursLeft = (createdAt) => {
    const diff = 24 * 60 * 60 * 1000 - (Date.now() - new Date(createdAt).getTime());
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  };

  /* ================= ACTIONS ================= */
  const handleAcceptConnection = async (connectionId) => {
    const res = await acceptConnection(connectionId);
    if (!res.success) return triggerToast(res.message || "Accept failed");
    triggerToast("Connection accepted");
    setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
  };

  const handleRejectConnection = async (connectionId) => {
    const res = await rejectConnection(connectionId);
    if (!res.success) return triggerToast(res.message || "Reject failed");
    triggerToast("Connection rejected");
    setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
  };

  const handleWithdrawRequest = async (connectionId) => {
    await withdrawConnection(connectionId);
    setSent((prev) => prev.filter((c) => c.connectionId !== connectionId));
    triggerToast("Request withdrawn");
  };

  const handleViewProfile = async (userId) => {
    const res = await getUserProfile(userId);
    if (res.success) setSelectedUser(res.data);
    else triggerToast("Profile not found");
  };

  const allReceived = [...received, ...acceptedReceived];

  return (
    <div className="p-6 max-w-[1400px] mx-auto bg-[#FDFCFD] min-h-screen relative">
      
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#3B1E54] text-white px-6 py-3 rounded-xl shadow-lg text-xs font-bold uppercase tracking-widest">
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* ================= RECEIVED ================= */}
        <section className="w-full lg:w-[55%]">
          <h2 className="text-lg font-black text-[#3B1E54] uppercase mb-6 tracking-widest">
            Received Connections
          </h2>

          <div className="space-y-5">
            {allReceived.length === 0 && <p className="text-gray-400 text-sm">No requests found</p>}

            {allReceived.map((c) => {
              const expired = isExpired(c.created_at);
              const isAccepted = c.status === "Accepted";

              return (
                <div
                  key={c.connectionId}
                  onClick={() => isAccepted && handleViewProfile(c.user_id || c.from_user)}
                  className={`rounded-2xl p-5 transition-all shadow-sm 
                  ${isAccepted ? "bg-green-50/70 cursor-pointer" : expired ? "opacity-40 bg-gray-50" : "bg-white shadow-md"}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-[#3B1E54]">{c.full_name}</h3>
                    {isAccepted ? (
                      <span className="text-[10px] bg-green-200 text-green-700 px-3 py-1 rounded-full font-black uppercase">Accepted</span>
                    ) : !expired ? (
                      <span className="text-xs text-pink-500 font-bold">{hoursLeft(c.created_at)}h left</span>
                    ) : null}
                  </div>

                  <p className="text-xs text-gray-500">{c.gender} • {c.occupation} • {c.city}</p>

                  {!expired && !isAccepted && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAcceptConnection(c.connectionId); }}
                        className="bg-[#228B22] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#90EE90] transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRejectConnection(c.connectionId); }}
                        className="bg-rose-50 text-rose-500 px-6 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-rose-100 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SENT ================= */}
        <section className="w-full lg:w-[45%] bg-[#FFF5F7] p-6 rounded-3xl shadow-sm">
          <h2 className="text-base font-black text-[#3B1E54] uppercase mb-6 tracking-widest">
            Sent Requests ({sent.length})
          </h2>

          <div className="space-y-4">
            {sent.map((c) => (
              <div key={c.connectionId} className="flex justify-between items-center bg-white/60 p-4 rounded-xl shadow-sm">
                <div>
                  <p className="font-bold text-[#3B1E54] text-sm">{c.receiver_work || "User Profile"}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.receiver_city} • {c.receiver_raasi}</p>
                </div>
                <button
                  onClick={() => handleWithdrawRequest(c.connectionId)}
                  className="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors hover:bg-rose-200"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-[#3B1E54]/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative p-8">
            
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#FFF5F7] text-[#3B1E54] font-bold hover:bg-[#FCE7EB] transition-colors"
            >✕</button>

            {/* HEADER */}
            <div className="flex flex-col items-center mb-10 text-center">
              <img
                src={`${Img_Url}/photos/${selectedUser.photo}`}
                className="w-24 h-24 object-cover rounded-2xl shadow-xl mb-4 bg-gray-100"
              />
              <h2 className="text-2xl font-black text-[#3B1E54] tracking-tight">{selectedUser.full_name}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                {selectedUser.city} • {selectedUser.country}
              </p>
            </div>

            {/* CONTENT SECTIONS */}
            <div className="space-y-12">
              <Section title="Personal Information">
                <Row label="Gender" value={selectedUser.gender} />
                <Row label="Date of Birth" value={selectedUser.dob?.split("T")[0]} />
                <Row label="Birth Time" value={selectedUser.birth_time} />
                <Row label="Birth Place" value={selectedUser.birth_place} />
                <Row label="Marital Status" value={selectedUser.marital_status} />
              </Section>

              <Section title="Education & Career">
                <Row label="Education" value={selectedUser.education} />
                <Row label="Occupation" value={selectedUser.occupation} />
                <Row label="Income" value={selectedUser.income} />
              </Section>

              <Section title="Family Details">
                <Row label="Father Name" value={selectedUser.father_name} />
                <Row label="Mother Name" value={selectedUser.mother_name} />
                <Row label="Grandparents" value={`${selectedUser.grandfather_name || '-'} / ${selectedUser.grandmother_name || '-'}`} />
                <Row label="Siblings" value={selectedUser.siblings} />
              </Section>

              <Section title="Astrology & Religion">
                <Row label="Raasi" value={selectedUser.raasi} />
                <Row label="Star" value={selectedUser.star} />
                <Row label="Dosham" value={selectedUser.dosham} />
              </Section>

              <Section title="Address">
                <div className="col-span-full">
                  <Row label="Residential Address" value={selectedUser.address} />
                </div>
              </Section>

              <Section title="Horoscope">
                <div className="pt-2">
                  {selectedUser.horoscope_uploaded ? (
                    <button
                      onClick={() => window.open(`http://localhost:5000/uploads/photos/${selectedUser.horoscope_file_name}`, "_blank")}
                      className="bg-[#3B1E54] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-[#2A153D] transition-all"
                    >
                      View Full Horoscope
                    </button>
                  ) : (
                    <div className="bg-[#FFF5F7] text-[#852D3E] px-6 py-2 rounded-full text-xs font-bold italic w-fit">
                      Document Not Shared
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE COMPONENTS (BORDERLESS) ================= */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-black text-[#3B1E54] uppercase tracking-[0.25em] mb-6 flex items-center gap-4">
      {title}
      <span className="h-[2px] w-8 bg-pink-100 rounded-full"></span>
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] text-[#852D3E] font-bold uppercase tracking-wider opacity-60 ml-1">
      {label}
    </label>
    <div className="bg-[#FFF5F7] rounded-xl px-4 py-3 text-sm text-[#3B1E54] font-bold shadow-sm">
      {value || <span className="text-gray-300 font-normal italic">—</span>}
    </div>
  </div>
);

export default MyConnection;