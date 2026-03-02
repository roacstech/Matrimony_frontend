import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User, Eye } from "lucide-react";
import { getEnumLabel } from "../../utils/convertHelper";

// ✅ API functions import
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
  const minutes = m;
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};

const PendingForms = () => {
  const [pending, setPending] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const displayMode = "both"; // or "tamil"
  // ================= LOAD PENDING =================
  useEffect(() => {
    const loadPending = async () => {
      try {
        const users = await getPendingForms();
        setPending(Array.isArray(users) ? users : []);
      } catch (error) {
        toast.error("Failed to load pending requests");
      }
    };
    loadPending();
  }, []);

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    try {
      const res = await adminApproveUser(id);
      toast.success(res.message || "Approved successfully");
      setPending((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  // ================= REJECT =================
  const handleReject = async (item) => {
    try {
      await adminRejectUser(item.id);
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      toast.success("User rejected successfully");
    } catch {
      toast.error("Rejection failed");
    }
  };

  // ================= VIEW PROFILE =================
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

  if (!pending.length) {
    return (
      <div className="p-10 text-center bg-white rounded-[30px] border border-[#EEEEEE] shadow-sm">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
          No Pending Requests
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 cursor-pointer px-2 md:px-0">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-[#5D4037]">
          Pending User Requests
        </h2>
        {/* <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
          Review new profile submissions
        </p> */}
      </div>

      {/* ================= TABLE LIST (Replicating AllUsers Head) ================= */}
      <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[#FAF6F3]/50 border-b border-[#EEEEEE]">
                <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Profile Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Contact Info
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">
                  Review Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {pending.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-[#FAF6F3]/30 transition-all"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#5D4037] overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-100 shadow-sm">
                        {item.photo ? (
                          <img
                            src={`${import.meta.env.VITE_IMG_URL}/photos/${item.photo}`}
                            alt="user"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-[#5D4037] leading-tight">
                          {item.profile?.fullName || item.name || "N/A"}
                        </p>
                        <p className="text-[9px] text-[#A67C52] font-bold uppercase tracking-widest mt-1">
                          <MapPin size={10} className="inline mr-1" />{" "}
                          {item.country || "India"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-[#5D4037] truncate max-w-[200px]">
                      <Mail size={12} className="inline mr-1 text-stone-400" />{" "}
                      {item.email}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => handleView(item)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#5D4037] bg-[#FAF6F3] border border-[#A67C52]/20 hover:bg-[#5D4037] hover:text-white rounded-xl transition-all shadow-sm mx-auto flex items-center justify-center"
                    >
                      View Profile
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-4 py-2 bg-[#5D4037] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1.5"
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="px-4 py-2 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-1.5"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL (KEEPING ORIGINAL DESIGN) ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 md:p-6">
          <div className="bg-[#FDFBF9] w-[900px] max-w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-6 md:p-10 relative">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-[#5D4037] text-lg z-10"
            >
              ✕
            </button>
            <div className="flex justify-center mb-6">
              {selectedUser.photo ? (
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                  alt="user"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#FAF6F3] flex items-center justify-center">
                  <User size={28} />
                </div>
              )}
            </div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-[#5D4037]">
                {selectedUser.fullName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedUser.city}, {selectedUser.country}
              </p>
              <p className="text-sm text-gray-500 mt-1">{selectedUser.email}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-4">
                  PERSONAL INFO
                </h3>
                <InfoRow
                  label="Gender / பாலினம்"
                  value={getEnumLabel(
                    "gender",
                    selectedUser.gender,
                    displayMode,
                  )}
                />{" "}
                <InfoRow
                  label="DOB / பிறந்த தேதி"
                  value={selectedUser.dob?.split("T")[0]}
                />
                <InfoRow
                  label="Birth Place / பிறந்த இடம் "
                  value={selectedUser.birth_place}
                />
                   <InfoRow
                  label="Birth Time / பிறந்த நேரம் "
                  value={formatTime12h(selectedUser.birthTime)}
                />
                <InfoRow
                  label="Marital Status / திருமண நிலை"
                  value={getEnumLabel(
                    "maritalStatus",
                    selectedUser.maritalStatus,
                    displayMode,
                  )}
                />{" "}
                <InfoRow
                  label="Email / மின்னஞ்சல்"
                  value={selectedUser.email}
                />
                <InfoRow
                  label="Phone / தொலைபேசி எண்"
                  value={selectedUser.phone}
                />
                <InfoRow label="Income / தொழில்" value={selectedUser.income} />
                <InfoRow
                  label="Work Location / வேலை இடம்"
                  value={selectedUser.workLocation}
                />
                <InfoRow
                  label="Education / கல்வி"
                  value={selectedUser.education}
                />
              </div>
              <div>
                <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-4">
                  FAMILY & DETAILS
                </h3>
                <InfoRow
                  label="Father/ தந்தை பெயர்"
                  value={selectedUser.father}
                />
                <InfoRow
                  label="Mother / தாய் பெயர்"
                  value={selectedUser.mother}
                />
                <InfoRow
                  label="Grandfather/ தாத்தா பெயர்"
                  value={selectedUser.grandfather}
                />
                <InfoRow
                  label="Grandmother/ பாட்டி பெயர்"
                  value={selectedUser.grandmother}
                />
                <InfoRow
                  label="Mother Side GF / தாய்வழி தாத்தா பெயர்"
                  value={selectedUser.motherSideGrandfather}
                />
                <InfoRow
                  label="Mother Side GM / தாய்வழி பாட்டி பெயர்"
                  value={selectedUser.motherSideGrandmother}
                />
                <InfoRow
                  label="Siblings/ உடன்பிறப்புகள்"
                  value={selectedUser.siblings}
                />
                <InfoRow
                  label="Raasi / இராசி"
                  value={getEnumLabel("raasi", selectedUser.raasi, displayMode)}
                />
                <InfoRow
                  label="Star / நட்சத்திரம்"
                  value={getEnumLabel("star", selectedUser.star, displayMode)}
                />
                <InfoRow
                  label="Dosham / தோஷாம்"
                  value={getEnumLabel(
                    "dosham",
                    selectedUser.dosham,
                    displayMode,
                  )}
                />{" "}
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-3">
                JADHAGAM FILE / ஜாதகம்
              </h3>
              {selectedUser.horoscope?.uploaded ? (
                <div className="flex items-center justify-between bg-[#FAF6F3] px-5 py-3 rounded-2xl">
                  <span className="text-sm text-[#5D4037] truncate">
                    {selectedUser.horoscope.fileName}
                  </span>
                  <a
                    href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#5D4037] text-white text-xs rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    View
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Not Uploaded</p>
              )}
            </div>
            <InfoRow
              label="Remarks / குறிப்புகள்"
              value={selectedUser.remarks}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-[#E6DFD8] text-sm">
    <span className="text-gray-400 uppercase text-[11px] tracking-wide pr-4">
      {label}
    </span>
    <span className="text-[#5D4037] font-medium text-right max-w-[55%]">
      {value || "-"}
    </span>
  </div>
);

export default PendingForms;
