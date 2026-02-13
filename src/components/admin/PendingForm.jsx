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
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white rounded-2xl w-[900px] p-8 shadow-xl relative">

      {/* Close */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-6 text-sm font-semibold text-gray-400 hover:text-black"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-6 text-center">
         <img
      src={`http://localhost:5000/uploads/photos/${selectedUser.photo}`}
      alt="user"
      className="avatar-img w-10 h-10 ml-100 rounded-[22px]"
    />
        <h2 className="text-lg font-bold text-[#5D4037]">
          {selectedUser.fullName}
        </h2>
        <p className="text-xs text-gray-500">
          {selectedUser.email}
        </p>
      </div>

      {/* Table Layout */}
      <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">

        <DataRow label="Gender" value={selectedUser.gender} />
        <DataRow label="Marital Status" value={selectedUser.maritalStatus} />

        <DataRow label="Date of Birth" value={selectedUser.dob?.split("T")[0]} />
        <DataRow label="Birth Time" value={selectedUser.birthTime} />

        <DataRow label="Education" value={selectedUser.education} />
        <DataRow label="Occupation" value={selectedUser.occupation} />

        <DataRow label="Income" value={selectedUser.income} />
        <DataRow label="Raasi" value={selectedUser.raasi} />

        <DataRow label="Star" value={selectedUser.star} />
        <DataRow label="Dosham" value={selectedUser.dosham} />

        <DataRow label="Father" value={selectedUser.father} />
        <DataRow label="Mother" value={selectedUser.mother} />

        <DataRow label="Grandfather" value={selectedUser.grandfather} />
        <DataRow label="Grandmother" value={selectedUser.grandmother} />

        <DataRow label="City" value={selectedUser.city} />
        <DataRow label="Country" value={selectedUser.country} />

        <DataRow label="Privacy" value={selectedUser.privacy} />
        <DataRow label="Status" value={selectedUser.status} />

      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default PendingForms;


/* ================= REUSABLE COMPONENTS ================= */

const DataRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    
    {/* Label */}
    <label className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">
      {label}
    </label>

    {/* Value Box */}
    <div className="bg-rose-50 text-gray-800 text-[13px] font-medium px-3 py-1.5 rounded-md">
      {value || "-"}
    </div>

  </div>
);





