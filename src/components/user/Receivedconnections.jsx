import React, { useEffect, useState } from "react";
import {
  getReceivedConnections,
  acceptConnection,
  rejectConnection,
  getUserProfile,
  getAcceptedConnections,
} from "../../api/userApi";
import { viewProfile } from "../../api/profilesApi";
import { getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";
import { X, CheckCircle, XCircle, Eye, Inbox, Download } from "lucide-react";

const Receivedconnections = () => {
  const [received, setReceived] = useState([]);
  const [acceptedReceived, setAcceptedReceived] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [fullImageUrl, setFullImageUrl] = useState(null); // ✅ NEW

  const Img_Url = import.meta.env.VITE_IMG_URL;
  const displayMode = "both";

  const closeFullImage = () => setFullImageUrl(null); // ✅ NEW

  const resolvePhotoSrc = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `${Img_Url}/photos/${photo}`;
  };

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const formatTime12h = (time) => {
    if (!time) return "—";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const isExpired = (createdAt) =>
    Date.now() - new Date(createdAt).getTime() >= 24 * 60 * 60 * 1000;

  useEffect(() => {
    const load = async () => {
      try {
        const receivedRes = await getReceivedConnections();
        if (receivedRes?.success && Array.isArray(receivedRes.data))
          setReceived(receivedRes.data);
      } catch (err) {
        console.error("Failed to load received connections", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAccepted = async () => {
      try {
        const res = await getAcceptedConnections();
        if (res?.success)
          setAcceptedReceived((res.data || []).map((c) => ({ ...c, status: "Accepted" })));
      } catch (err) {
        console.error("Failed to load accepted connections", err);
      }
    };
    loadAccepted();
  }, []);

  const refreshAccepted = async () => {
    try {
      const res = await getAcceptedConnections();
      if (res?.success)
        setAcceptedReceived((res.data || []).map((c) => ({ ...c, status: "Accepted" })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (connectionId) => {
    const res = await acceptConnection(connectionId);
    if (!res.success) return triggerToast(res.message || "Accept failed");
    triggerToast("Connection accepted");
    setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
    await refreshAccepted();
  };

  const handleReject = async (connectionId) => {
    const res = await rejectConnection(connectionId);
    if (!res.success) return triggerToast(res.message || "Reject failed");
    triggerToast("Connection rejected");
    setReceived((prev) => prev.filter((c) => c.connectionId !== connectionId));
  };

  const handleViewProfile = async (userId, fuser, profileId) => {
    if (!profileId) return triggerToast("Profile ID missing");
    try {
      const token = localStorage.getItem("accesstoken");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const trackRes = await viewProfile(payload.id, profileId);
      if (trackRes.success) {
        const res = await getUserProfile(userId);
        if (res.success) setSelectedUser(res.data);
        else triggerToast("Could not load profile");
      } else {
        triggerToast(trackRes.message || "Failed to initialize view");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error opening profile");
    }
  };

  const allRows = [...received, ...acceptedReceived];

  const getStatus = (c) => {
    if (c.status === "Accepted") return "accepted";
    if (isExpired(c.created_at)) return "expired";
    return "pending";
  };

  return (
    <div className="space-y-5">

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#111827] text-white px-6 py-3 rounded-xl shadow-2xl text-xs font-medium uppercase tracking-widest border border-blue-500/30">
          {toast.msg}
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Inbox size={18} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Received Connections</h2>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
          {allRows.length} total
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Gender</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Occupation</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-14 text-sm text-gray-400">
                    No received requests found
                  </td>
                </tr>
              ) : (
                allRows.map((c, idx) => {
                  const status = getStatus(c);
                  return (
                    <tr
                      key={c.connectionId}
                      className={`border-b border-gray-50 transition-colors ${
                        status === "expired"
                          ? "opacity-40"
                          : idx % 2 === 1
                          ? "bg-gray-50/40 hover:bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Gender */}
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {getEnumLabel("gender", c.gender, displayMode)}
                      </td>

                      {/* Occupation */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {c.occupation || "—"}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {c.city || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {status === "accepted" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Accepted
                          </span>
                        )}
                        {status === "expired" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-400 uppercase">
                            Expired
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-yellow-50 text-yellow-600 border border-yellow-100 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {status === "accepted" && (
                            <button
                              onClick={() => handleViewProfile(c.user_id, c.from_user, c.profileId)}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                            >
                              <Eye size={13} /> View
                            </button>
                          )}
                          {status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAccept(c.connectionId)}
                                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all"
                              >
                                <CheckCircle size={13} /> Accept
                              </button>
                              <button
                                onClick={() => handleReject(c.connectionId)}
                                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </>
                          )}
                          {status === "expired" && (
                            <span className="text-[10px] text-gray-300 font-medium uppercase">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Profile Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[900px] max-w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 md:p-10 relative border border-gray-200">

            <button
              onClick={() => setSelectedUser(null)}
              className="cursor-pointer absolute top-5 right-5 w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition flex items-center justify-center"
            >
              <X size={16} />
            </button>

            {/* Avatar + name */}
            <div className="flex flex-col items-center mb-8">
              <div
                onClick={() => selectedUser.photo && setFullImageUrl(resolvePhotoSrc(selectedUser.photo))}
                className={`w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center mb-3 ${
                  selectedUser.photo
                    ? "cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-105 transition-all"
                    : ""
                }`}
              >
                {selectedUser.photo ? (
                  <img
                    src={resolvePhotoSrc(selectedUser.photo)}
                    className="w-full h-full object-cover"
                    alt="user"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-gray-400">
                    {selectedUser.full_name?.charAt(0)}
                  </span>
                )}
              </div>
              {selectedUser.photo && (
                <p className="text-[10px] text-gray-400 mt-1 italic cursor-pointer hover:text-blue-500" onClick={() => setFullImageUrl(resolvePhotoSrc(selectedUser.photo))}>
                  Click photo to view full size
                </p>
              )}
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.full_name}</h2>
              <p className="text-sm text-blue-600 mt-1">
                {selectedUser.city}, {selectedUser.country}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{selectedUser.email}</p>
            </div>

            {/* Two-column info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
                  Personal Info
                </p>
                <InfoRow label="Gender / பாலினம்" value={getEnumLabel("gender", selectedUser.gender, displayMode)} />
                <InfoRow label="DOB / பிறந்த தேதி" value={selectedUser.dob?.split("T")[0]} />
                <InfoRow label="Age / வயது" value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"} />
                <InfoRow label="Birth Place / பிறந்த இடம்" value={selectedUser.birth_place} />
                <InfoRow label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birth_time)} />
                <InfoRow label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.marital_status, displayMode)} />
                <InfoRow label="Email / மின்னஞ்சல்" value={selectedUser.email} />
                <InfoRow label="Phone / தொலைபேசி" value={selectedUser.phone} />
                <InfoRow label="Monthly Income / மாத வருமானம்" value={selectedUser.income} />
                <InfoRow label="Work Location / வேலை இடம்" value={selectedUser.work_location} />
                <InfoRow label="Education / கல்வி" value={selectedUser.education} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
                  Family & Details
                </p>
                <InfoRow label="Father / தந்தை" value={selectedUser.father_name} />
                <InfoRow label="Mother / தாய்" value={selectedUser.mother_name} />
                <InfoRow label="Grandfather / தாத்தா" value={selectedUser.grandfather_name} />
                <InfoRow label="Grandmother / பாட்டி" value={selectedUser.grandmother_name} />
                <InfoRow label="Mother Side GF / தாய்வழி தாத்தா" value={selectedUser.mother_side_grandfather_name} />
                <InfoRow label="Mother Side GM / தாய்வழி பாட்டி" value={selectedUser.mother_side_grandmother_name} />
                <InfoRow label="Siblings / உடன்பிறப்புகள்" value={selectedUser.siblings} />
                <InfoRow label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
                <InfoRow label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
                <InfoRow label="Dosham / தோஷம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
              </div>
            </div>

            {/* Horoscope */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Jadhagam / ஜாதகம்
              </p>
              {selectedUser.horoscope_uploaded ? (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {selectedUser.horoscope_file_name}
                  </span>
                  <a
                    href={selectedUser.horoscope_file_url || `${Img_Url}/photos/${selectedUser.horoscope_file_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not uploaded</p>
              )}
            </div>

            {/* Remarks */}
            <div className="mt-4">
              <InfoRow label="Remarks / குறிப்புகள்" value={selectedUser.remarks} />
            </div>
          </div>
        </div>
      )}

      {/* ✅ Full-size Image Lightbox */}
      {fullImageUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[130] p-4"
          onClick={closeFullImage} // click anywhere outside image to close
        >
          {/* Close button */}
          <button
            onClick={closeFullImage}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
          >
            <X size={18} />
          </button>

          {/* Image — clicking image itself does NOT close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src={fullImageUrl}
              alt="Full size profile"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
            />

            {/* Bottom download link */}
            <a
              href={fullImageUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-semibold rounded-lg transition-all backdrop-blur-sm border border-white/10"
            >
              <Download size={12} /> Open original
            </a>
          </div>

          {/* Click outside hint */}
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            Click outside to close
          </p>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-50 text-sm px-1 hover:bg-gray-50 transition-colors rounded">
    <span className="text-xs text-gray-400 uppercase tracking-widest pr-4 shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 text-right max-w-[55%]">
      {value || "—"}
    </span>
  </div>
);

export default Receivedconnections;