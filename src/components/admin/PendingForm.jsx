import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User, Eye } from "lucide-react";

// ✅ API functions import
import {
  getPendingForms,
  adminApproveUser,
  adminRejectUser,
  getUserProfile,
} from "../../api/adminApi";

const PendingForms = () => {
  const [pending, setPending] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

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
      toast.error("User rejected ❌");
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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-[#5D4037]">
          Pending User Requests
        </h2>
        <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
          Review new profile submissions
        </p>
      </div>

      {/* ================= LIST ================= */}
      <div className="grid gap-4">
        {pending.map((item) => (
          <div
            key={item.id}
            className="bg-white  rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF6F3] flex items-center justify-center">
                {item.photo ? (
                  <img
                    src={`http://localhost:5000/uploads/photos/${item.photo}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} />
                )}
              </div>

              <div>
<p className="text-[15px] font-black text-[#5D4037] leading-none mb-2"> {item.profile?.fullName || item.name || "N/A"} </p>
                <p className="flex items-center gap-1 text-[11px] text-stone-500">
                  <Mail size={12} /> {item.email}
                </p>

                <p className="flex items-center gap-1 text-[11px] text-stone-500">
                  <MapPin size={12} /> {item.country || "India"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
             <button onClick={() => handleApprove(item.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#5D4037] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm" > <Check size={14} /> Accept </button>

              <button onClick={() => handleReject(item)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-rose-500 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all" > <X size={14} /> Reject </button>

              <button onClick={() => handleView(item)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-[#5D4037] border border-[#A67C52] rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FAEBCF] transition-all" > <Eye size={14} /> </button>
            </div>
          </div>
        ))}
      </div>

     
      {/* ================= MODAL ================= */}
{selectedUser && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
    <div className="bg-[#FDFBF9] w-[900px] max-w-full rounded-3xl shadow-xl p-10 relative">

      {/* Close */}
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-[#5D4037] text-lg"
      >
        ✕
      </button>

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        {selectedUser.photo ? (
          <img
            src={`http://localhost:5000/uploads/photos/${selectedUser.photo}`}
            alt="user"
            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-[#FAF6F3] flex items-center justify-center">
            <User size={28} />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-[#5D4037]">
          {selectedUser.fullName}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedUser.city}, {selectedUser.country}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-12">

        {/* LEFT */}
        <div>
          <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-4">
            PERSONAL INFO
          </h3>

          <InfoRow label="Gender" value={selectedUser.gender} />
          <InfoRow label="DOB" value={selectedUser.dob?.split("T")[0]} />
          <InfoRow label="Marital Status" value={selectedUser.maritalStatus} />
          <InfoRow label="Email" value={selectedUser.email} />
          <InfoRow label="Income" value={selectedUser.income} />
          <InfoRow label="Birth Place" value={selectedUser.birthPlace} />
          <InfoRow label="Education" value={selectedUser.education} />
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-4">
            FAMILY & ASTROLOGY
          </h3>

          <InfoRow label="Father" value={selectedUser.father} />
          <InfoRow label="Mother" value={selectedUser.mother} />
          <InfoRow label="Grandfather" value={selectedUser.grandfather} />
          <InfoRow label="Grandmother" value={selectedUser.grandmother} />
          <InfoRow label="Siblings" value={selectedUser.siblings} />
          <InfoRow label="Raasi" value={selectedUser.raasi} />
          <InfoRow label="Star" value={selectedUser.star} />
          <InfoRow label="Dosham" value={selectedUser.dosham} />
        </div>
      </div>

      {/* HOROSCOPE SECTION (Separate Row Full Width) */}
      <div className="mt-10">
        <h3 className="text-xs tracking-widest text-[#A67C52] font-semibold mb-3">
          JADHAGAM FILE
        </h3>

        {selectedUser.horoscope?.uploaded ? (
          <div className="flex items-center justify-between bg-[#FAF6F3] px-5 py-3 rounded-2xl">
            <span className="text-sm text-[#5D4037] truncate">
              {selectedUser.horoscope.fileName}
            </span>

            <a
              href={`http://localhost:5000/uploads/photos/${selectedUser.horoscope.fileName}`}
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

    </div>
  </div>
)}



    </div>
  );
};

export default PendingForms;


/* ================= REUSABLE COMPONENTS ================= */

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-[#E6DFD8] text-sm">
    <span className="text-gray-400 uppercase text-[11px] tracking-wide">
      {label}
    </span>
    <span className="text-[#5D4037] font-medium text-right max-w-[55%]">
      {value || "-"}
    </span>
  </div>
);






