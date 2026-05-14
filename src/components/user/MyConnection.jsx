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
import { viewProfile } from "../../api/profilesApi";
import { getEnumOptions, getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";

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
  const displayMode = "both";

  const formatTime12h = (time) => {
    if (!time) return "—";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ================= LOAD CONNECTIONS ================= */
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const receivedRes = await getReceivedConnections();
        const sentRes = await getSentConnections();
        if (receivedRes?.success && Array.isArray(receivedRes.data))
          setReceived(receivedRes.data);
        if (sentRes?.success && Array.isArray(sentRes.data))
          setSent(sentRes.data);
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

  const isExpired = (createdAt) =>
    Date.now() - new Date(createdAt).getTime() >= 24 * 60 * 60 * 1000;

  const refreshAcceptedConnections = async () => {
    try {
      const res = await getAcceptedConnections();
      if (res?.success) {
        const accepted = (res.data || []).map((c) => ({ ...c, status: "Accepted" }));
        setAcceptedReceived(accepted);
      }
    } catch (err) {
      console.error("Failed to refresh accepted connections", err);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    const res = await acceptConnection(connectionId);
    if (!res.success) return triggerToast(res.message || "Accept failed");
    triggerToast("Connection accepted");
    setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
    await refreshAcceptedConnections();
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

  const handleViewProfile = async (userId, fuser, profileId) => {
    if (!profileId) return triggerToast("Error: Profile ID is missing from data");
    try {
      const token = localStorage.getItem("accesstoken");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const viewerId = payload.id;
      const trackRes = await viewProfile(viewerId, profileId);
      if (trackRes.success) {
        const res = await getUserProfile(userId);
        if (res.success) setSelectedUser(res.data);
        else triggerToast("Could not load profile details");
      } else {
        triggerToast(trackRes.message || "Failed to initialize view");
      }
    } catch (err) {
      console.error("View Profile Error:", err);
      triggerToast("An error occurred while opening the profile");
    }
  };

  const allReceived = [...received, ...acceptedReceived];
  const filteredSent = sent.filter(
    (c) =>
      c.status !== "Accepted" &&
      !acceptedReceived.some((a) => a.connectionId === c.connectionId)
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto min-h-screen relative">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#111827] text-white px-6 py-3 rounded-xl shadow-2xl text-xs font-medium uppercase tracking-widest border border-blue-500/30">
          {toast.msg}
        </div>
      )}

      {/* ================= TWO EQUAL COLUMNS ================= */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* ===== RECEIVED ===== */}
        <section className="w-full lg:w-1/2">
          <h2 className="text-sm font-semibold text-[#111827]  mb-6 tracking-widest">
            Received Connections
          </h2>

          <div className="space-y-4">
            {allReceived.length === 0 && (
              <p className="text-gray-400 text-sm font-medium">No requests found</p>
            )}

            {allReceived.map((c) => {
              const expired = isExpired(c.created_at);
              const isAccepted = c.status === "Accepted";

              return (
                <div
                  key={c.connectionId}
                  className={`rounded p-5 transition-all border
                    ${isAccepted
                      ? "bg-blue-50/50 border-blue-100"
                      : expired
                      ? "opacity-40 bg-gray-50 border-transparent"
                      : "bg-white border-gray-100 shadow-sm"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    {isAccepted ? (
                      <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-medium uppercase">
                        Accepted
                      </span>
                    ) : expired ? (
                      <span className="text-[10px] bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-medium uppercase">
                        Expired
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    {getEnumLabel("gender", c.gender, displayMode)} •{" "}
                    {c.occupation} • {c.city}
                  </p>

                  {isAccepted && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleViewProfile(c.user_id, c.from_user, c.profileId)}
                        className="cursor-pointer bg-[#1A5AF0] text-white px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest hover:bg-[#111827] transition-colors shadow-sm"
                      >
                        View Profile
                      </button>
                    </div>
                  )}

                  {!expired && !isAccepted && (
                    <div className="flex gap-3 mt-4 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAcceptConnection(c.connectionId); }}
                        className="cursor-pointer bg-[#1A5AF0] text-white px-6 py-2 rounded-full text-[10px] font-medium uppercase tracking-widest hover:bg-[#111827] transition-colors shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRejectConnection(c.connectionId); }}
                        className="cursor-pointer bg-white text-rose-500 border border-rose-100 px-6 py-2 rounded-full text-[10px] font-medium uppercase hover:bg-rose-50 transition-colors"
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

        {/* ===== SENT ===== */}
        <section className="w-full lg:w-1/2">
          <h2 className="text-sm font-semibold text-[#111827]  mb-6 tracking-widest">
            Sent Requests ({filteredSent.length})
          </h2>

          <div className="space-y-4">
            {filteredSent.map((c) => (
              <div
                key={c.connectionId}
                className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded hover:border-blue-100 transition-colors shadow-sm"
              >
                <div>
                  <p className="font-medium text-[#111827] text-sm">
                    {c.receiver_work || "User Profile"}
                  </p>
                  <p className="text-[10px] text-[#1A5AF0] font-medium uppercase tracking-widest mt-1">
                    {c.receiver_city} •{" "}
                    {getEnumLabel("raasi", c.receiver_raasi, displayMode)}
                  </p>
                </div>
                <button
                  onClick={() => handleWithdrawRequest(c.connectionId)}
                  className="cursor-pointer bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-[10px] font-medium uppercase transition-colors hover:bg-rose-100"
                >
                  Cancel
                </button>
              </div>
            ))}

            {filteredSent.length === 0 && (
              <p className="text-gray-400 text-sm font-medium">No sent requests</p>
            )}
          </div>
        </section>
      </div>

      {/* ================= PROFILE MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-[#111827]/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl relative p-8 border border-gray-100">
            <button
              onClick={() => setSelectedUser(null)}
              className="cursor-pointer fixed lg:absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-[#F1F5F9] text-[#111827] font-medium hover:bg-[#1A5AF0] hover:text-white transition-all shadow-md z-[120]"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="flex flex-col items-center mb-12 text-center">
              <div className="relative">
                <img
                  src={`${Img_Url}/photos/${selectedUser.photo}`}
                  className="w-28 h-28 object-cover rounded-3xl shadow-2xl mb-4 bg-gray-100 border-4 border-white"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#1A5AF0] w-6 h-6 rounded-full border-4 border-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#111827] tracking-tight">
                {selectedUser.full_name}
              </h2>
              <p className="text-[10px] font-medium text-[#1A5AF0] uppercase tracking-[0.3em] mt-2">
                {selectedUser.city} • {selectedUser.country}
              </p>
              <p className="text-[10px] font-medium text-gray-400 lowercase tracking-[0.3em] mt-2">
                {selectedUser.email}
              </p>
            </div>

            {/* CONTENT SECTIONS */}
            <div className="space-y-12">
              <Section title="Personal Information / தனிப்பட்ட விவரங்கள்">
                <Row label="Gender / பாலினம்" value={getEnumLabel("gender", selectedUser.gender, displayMode)} />
                <Row label="Date of Birth / பிறந்த தேதி" value={selectedUser.dob?.split("T")[0]} />
                <Row label="Age / வயது" value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"} />
                <Row label="Birth Place / பிறந்த இடம்" value={selectedUser.birth_place} />
                <Row label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birth_time)} />
                <Row label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.marital_status, displayMode)} />
                <Row label="Email / மின்னஞ்சல்" value={selectedUser.email} />
                <Row label="Phone Number / தொலைபேசி எண்" value={selectedUser.phone} />
              </Section>

              <Section title="Education & Career / கல்வி & தொழில்">
                <Row label="Education / கல்வி" value={selectedUser.education} />
                <Row label="Occupation / தொழில்" value={selectedUser.occupation} />
                <Row label="Income / வருமானம்" value={selectedUser.income} />
                <Row label="Work Location / வேலை இடம்" value={selectedUser.workLocation || selectedUser.work_location} />
              </Section>

              <Section title="Family Details / குடும்ப விவரங்கள்">
                <Row label="Father Name / தந்தை பெயர்" value={selectedUser.father_name} />
                <Row label="Mother Name / தாய் பெயர்" value={selectedUser.mother_name} />
                <Row label="Grandfather / தாத்தா" value={selectedUser.grandfather_name} />
                <Row label="Grandmother / பாட்டி" value={selectedUser.grandmother_name} />
                <Row label="Mother Side Grandfather / தாய்வழி தாத்தா" value={selectedUser.motherSideGrandfather || selectedUser.mother_side_grandfather_name} />
                <Row label="Mother Side Grandmother / தாய்வழி பாட்டி" value={selectedUser.motherSideGrandmother || selectedUser.mother_side_grandmother_name} />
                <Row label="Siblings / உடன்பிறப்புகள்" value={selectedUser.siblings} />
              </Section>

              <Section title="Astrology & Religion / ஜாதகம் & மதம்">
                <Row label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
                <Row label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
                <Row label="Dosham / தோஷம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
              </Section>

              <Section title="Address / முகவரி">
                <Row label="Residential Address / வீட்டு முகவரி" value={selectedUser.address} />
                <Row label="City / நகரம்" value={selectedUser.city} />
                <Row label="Country / நாடு" value={selectedUser.country} />
                <Row label="Remarks / குறிப்புகள்" value={selectedUser.remarks} />
              </Section>

              <Section title="Horoscope / ஜாதகம்">
                <div className="pt-2">
                  {selectedUser.horoscope_uploaded ? (
                    <button
                      onClick={() => window.open(`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope_file_name}`, "_blank")}
                      className="cursor-pointer bg-[#1A5AF0] text-white px-8 py-3 rounded-full text-[10px] font-medium uppercase tracking-widest shadow-sm hover:bg-[#111827] transition-all"
                    >
                      View Horoscope / ஜாதகம் பார்க்க
                    </button>
                  ) : (
                    <div className="bg-gray-100 text-gray-400 px-6 py-2 rounded-full text-xs font-medium italic w-fit">
                      Document Not Shared / பதிவேற்றம் இல்லை
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

/* ================= REUSABLE COMPONENTS ================= */
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-[0.25em] mb-6 flex items-center gap-4">
      {title}
      <span className="h-[2px] w-8 bg-blue-100 rounded-full" />
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] text-[#1A5AF0] font-medium uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="bg-[#F8FAFC] border border-gray-50 rounded-xl px-4 py-3 text-sm text-[#111827] font-medium shadow-sm">
      {value || <span className="text-gray-300 font-normal italic">—</span>}
    </div>
  </div>
);

export default MyConnection;