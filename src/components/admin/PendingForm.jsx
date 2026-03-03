import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User, Eye } from "lucide-react";
import { getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";

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

// if (!pending.length) {
//   return (
//     <div className="p-10 text-center bg-white rounded-[30px] border border-gray-100 shadow-sm">
//       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//         No Pending Requests
//       </p>
//     </div>
//   );
// }

  return (
    <div className="space-y-6 cursor-pointer px-2 md:px-0">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-black">
          Pending User Requests
        </h2>
      </div>

      {/* ================= TABLE LIST ================= */}
      <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-blue-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Profile Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Contact Info
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Review Details
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-50">
  {pending.length === 0 ? (
    <tr>
      <td
        colSpan="4"
        className="text-center py-16 text-gray-400 font-bold text-sm"
      >
        No Pending Requests
      </td>
    </tr>
  ) : (
    pending.map((item) => (
      <tr
        key={item.id}
        className="group hover:bg-blue-50/20 transition-all"
      >
        <td className="px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A5AF0] overflow-hidden flex-shrink-0 flex items-center justify-center border border-blue-50 shadow-sm">
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
              <p className="text-[14px] font-black text-black leading-tight">
                {item.profile?.fullName || item.name || "N/A"}
              </p>
              <p className="text-[9px] text-[#1A5AF0] font-bold uppercase tracking-widest mt-1">
                <MapPin size={10} className="inline mr-1" />
                {item.country || "India"}
              </p>
            </div>
          </div>
        </td>

        <td className="px-8 py-5">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-gray-400 shrink-0" />
            <p className="text-xs font-bold text-black whitespace-nowrap">
              {item.email}
            </p>
          </div>
        </td>

        <td className="px-8 py-5 text-center">
          <button
            onClick={() => handleView(item)}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1A5AF0] bg-white border border-[#1A5AF0] hover:bg-[#1A5AF0] hover:text-white rounded-xl transition-all shadow-sm mx-auto flex items-center justify-center"
          >
            View Profile
          </button>
        </td>

        <td className="px-8 py-5">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleApprove(item.id)}
              className="px-4 py-2 bg-[#1A5AF0] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
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
    ))
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-6">
          <div className="bg-white w-[900px] max-w-full max-h-[90vh] overflow-y-auto rounded-[30px] shadow-2xl p-6 md:p-10 relative border border-gray-100">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-black font-black text-lg z-10 hover:text-[#1A5AF0]"
            >
              ✕
            </button>
            <div className="flex justify-center mb-6">
              {selectedUser.photo ? (
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-blue-50"
                  alt="user"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <User size={28} className="text-[#1A5AF0]" />
                </div>
              )}
            </div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-black">
                {selectedUser.fullName}
              </h2>
              <p className="text-sm font-bold text-[#1A5AF0] mt-1 uppercase tracking-widest">
                {selectedUser.city}, {selectedUser.country}
              </p>
              <p className="text-sm font-bold  text-gray-400 mt-1">{selectedUser.email}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xs tracking-widest text-gray-400 font-black mb-4 uppercase border-b border-gray-100 pb-2">
                  PERSONAL INFO
                </h3>
                <InfoRow
                  label="Gender / பாலினம்"
                  value={getEnumLabel("gender", selectedUser.gender, displayMode)}
                />
                <InfoRow
                  label="DOB / பிறந்த தேதி"
                  value={selectedUser.dob?.split("T")[0]}
                />
                <InfoRow
                  label="Age / வயது"
                  value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"}
                />
                <InfoRow
                  label="Birth Place / பிறந்த இடம் "
                  value={selectedUser.birthPlace}
                />
                <InfoRow
                  label="Birth Time / பிறந்த நேரம் "
                  value={formatTime12h(selectedUser.birthTime)}
                />
                <InfoRow
                  label="Marital Status / திருமண நிலை"
                  value={getEnumLabel("maritalStatus", selectedUser.maritalStatus, displayMode)}
                />
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
                <h3 className="text-xs tracking-widest text-gray-400 font-black mb-4 uppercase border-b border-gray-100 pb-2">
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
                  value={getEnumLabel("dosham", selectedUser.dosham, displayMode)}
                />
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-xs tracking-widest text-gray-400 font-black mb-3 uppercase">
                JADHAGAM FILE / ஜாதகம்
              </h3>
              {selectedUser.horoscope?.uploaded ? (
                <div className="flex items-center justify-between bg-blue-50/50 px-5 py-3 rounded-2xl border border-blue-100">
                  <span className="text-sm font-bold text-black truncate">
                    {selectedUser.horoscope.fileName}
                  </span>
                  <a
                    href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#1A5AF0] text-white text-xs rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-400 font-bold">Not Uploaded</p>
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
  <div className="flex justify-between py-2 border-b border-gray-100 text-sm hover:bg-blue-50/10 transition-colors px-1">
    <span className="text-gray-400 uppercase text-[10px] font-black tracking-widest pr-4">
      {label}
    </span>
    <span className="text-black font-bold text-right max-w-[55%]">
      {value || "-"}
    </span>
  </div>
);

export default PendingForms;