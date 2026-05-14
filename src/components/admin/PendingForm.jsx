import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User, Eye, Clock, Download, FileText } from "lucide-react";
import { getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";
import {
  getPendingForms,
  adminApproveUser,
  adminRejectUser,
  getUserProfile,
} from "../../api/adminApi";

const formatTime12h = (time) => {
  if (!time) return "-";
  const [h, m] = time.split(":");
  let hours = Number(h);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${m} ${period}`;
};

const PendingForms = () => {
  const [pending, setPending] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const displayMode = "both";

  /* ================= LOAD PENDING ================= */
  useEffect(() => {
    const loadPending = async () => {
      try {
        const users = await getPendingForms();
        setPending(Array.isArray(users) ? users : []);
      } catch {
        toast.error("Failed to load pending requests");
      }
    };
    loadPending();
  }, []);

  /* ================= APPROVE ================= */
  const handleApprove = async (id) => {
    try {
      const res = await adminApproveUser(id);
      toast.success(res.message || "Approved successfully");
      setPending((prev) => prev.filter((item) => item.id !== id));
    } catch {
      toast.error("Approval failed");
    }
  };

  /* ================= REJECT ================= */
  const handleReject = async (item) => {
    try {
      await adminRejectUser(item.id);
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      toast.success("User rejected successfully");
    } catch {
      toast.error("Rejection failed");
    }
  };

  /* ================= VIEW PROFILE ================= */
  const handleView = async (item) => {
    try {
      setLoadingProfile(true);
      const fullProfile = await getUserProfile(item.id);
      setSelectedUser(fullProfile);
    } catch {
      toast.error("Failed to load profile details");
    } finally {
      setLoadingProfile(false);
    }
  };

  const closeModal = () => setSelectedUser(null);

  return (
    <div className="space-y-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock size={18} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
        </div>
        <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full border border-blue-100">
          {pending.length} pending
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Profile</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Review</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-14 text-sm text-gray-400">
                    No pending requests at the moment
                  </td>
                </tr>
              ) : (
                pending.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                    }`}
                  >
                    {/* Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.photo ? (
                            <img
                              // ✅ photo is already a full S3 URL — use it directly
                              src={item.photo}
                              alt="user"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {item.profile?.fullName || item.name || item.fullName || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.email || "—"}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                        {item.country || "India"}
                      </div>
                    </td>

                    {/* View button */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleView(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>

                    {/* Accept / Reject */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all"
                        >
                          <Check size={13} /> Accept
                        </button>
                        <button
                          onClick={() => handleReject(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-500 border border-rose-200 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[900px] max-w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 md:p-10 relative border border-gray-200">

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition flex items-center justify-center"
            >
              <X size={16} />
            </button>

            {/* Avatar + name */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center mb-3">
                {selectedUser.photo ? (
                  <img
                    // ✅ photo is a full S3 URL — use directly, no VITE_IMG_URL prefix needed
                    src={selectedUser.photo}
                    className="w-full h-full object-cover"
                    alt="user"
                  />
                ) : (
                  <User size={24} className="text-gray-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.fullName}</h2>
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
                <InfoRow label="Birth Place / பிறந்த இடம்" value={selectedUser.birthPlace} />
                <InfoRow label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birthTime)} />
                <InfoRow label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.maritalStatus, displayMode)} />
                <InfoRow label="Email / மின்னஞ்சல்" value={selectedUser.email} />
                <InfoRow label="Phone / தொலைபேசி எண்" value={selectedUser.phone} />
                <InfoRow label="Income / வருமானம்" value={selectedUser.income} />
                <InfoRow label="Work Location / வேலை இடம்" value={selectedUser.workLocation} />
                <InfoRow label="Education / கல்வி" value={selectedUser.education} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
                  Family & Details
                </p>
                <InfoRow label="Father / தந்தை பெயர்" value={selectedUser.father} />
                <InfoRow label="Mother / தாய் பெயர்" value={selectedUser.mother} />
                <InfoRow label="Grandfather / தாத்தா பெயர்" value={selectedUser.grandfather} />
                <InfoRow label="Grandmother / பாட்டி பெயர்" value={selectedUser.grandmother} />
                <InfoRow label="Mother Side GF / தாய்வழி தாத்தா" value={selectedUser.motherSideGrandfather} />
                <InfoRow label="Mother Side GM / தாய்வழி பாட்டி" value={selectedUser.motherSideGrandmother} />
                <InfoRow label="Siblings / உடன்பிறப்புகள்" value={selectedUser.siblings} />
                <InfoRow label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
                <InfoRow label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
                <InfoRow label="Dosham / தோஷாம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
              </div>
            </div>

            {/* Horoscope file */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Jadhagam File / ஜாதகம்
              </p>
              {selectedUser.horoscope?.uploaded ? (
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {selectedUser.horoscope.fileName}
                    </span>
                  </div>
                  <a
                    // ✅ horoscope.fileUrl is already the full S3 URL — use it directly
                    href={selectedUser.horoscope.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download size={13} /> View
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
    </div>
  );
};

/* ── InfoRow ── */
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

export default PendingForms;