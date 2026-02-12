import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User, Eye } from "lucide-react";

// ✅ API functions import
import {
  getPendingForms,
  adminApproveUser,
  adminRejectUser,
 
} from "../../api/adminApi";

const PendingForms = () => {
  const [pending, setPending] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);


  const [selectedUser, setSelectedUser] = useState(null); // For modal

  // LOAD PENDING
  useEffect(() => {
    const loadPending = async () => {
      try {
        const users = await getPendingForms();
        setPending(Array.isArray(users) ? users : []); // Ensure array
      } catch (error) {
        console.error("Failed to load pending requests", error);
        toast.error("Failed to load pending requests");
      }
    };
    loadPending();
  }, []);

  // APPROVE
  const handleApprove = async (id) => {
    try {
      const res = await adminApproveUser(id);

      toast.success(res.message || "Approved successfully");

      setPending((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // REJECT
  const handleReject = async (item) => {
    try {
      await adminRejectUser(item.id);
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      toast.error("User rejected ❌");
    } catch {
      toast.error("Rejection failed");
    }
  };

  // VIEW DETAILS
  const handleView = async (item) => {
  try {
    setLoadingProfile(true);

    const fullProfile = await getUserProfile(item.id);

    setSelectedUser(fullProfile);

  } catch (err) {
    toast.error("Failed to load profile details");
  } finally {
    setLoadingProfile(false);
  }
};


  // CLOSE MODAL
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
      {/* Header */}
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight">
          Pending User Requests
        </h2>
        <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
          Review new profile submissions
        </p>
      </div>

      {/* Pending Forms */}
      <div className="grid gap-4">
        {pending.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#EEEEEE] rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6F3] flex items-center justify-center text-[#A67C52] flex-shrink-0">
                {item.profile?.photo ? (
                   <img
      src={
        item.profile?.photo
          ? `http://localhost:5000/${item.profile.photo}`
          : "https://i.pravatar.cc/100"
      }
      alt={item.profile?.fullName || "User"}
      className="w-full h-full object-cover"
    />
                ) : (
                  <User size={24} />
                )}
              </div>

              <div>
                <p className="text-[15px] font-black text-[#5D4037] leading-none mb-2">
                  {item.profile?.fullName || item.name || "N/A"}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 lowercase">
                    <Mail size={12} className="text-[#A67C52]" /> {item.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 uppercase tracking-tight">
                    <MapPin size={12} className="text-[#A67C52]" />{" "}
                    {item.profile?.country || "INDIA"}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApprove(item.id)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#5D4037] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
              >
                <Check size={14} /> Accept
              </button>

              <button
                onClick={() => handleReject(item)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-rose-500 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
              >
                <X size={14} /> Reject
              </button>

              <button
                onClick={() => handleView(item)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-[#5D4037] border border-[#A67C52] rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FAEBCF] transition-all"
              >
                <Eye size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing user */}
    {selectedUser && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-96 relative overflow-y-auto max-h-[80vh]">

      <h2 className="text-lg font-black text-[#5D4037] mb-4">
        {selectedUser.full_name || selectedUser.name}
      </h2>

      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Phone:</strong> {selectedUser.phone}</p>
      <p><strong>Age:</strong> {selectedUser.age}</p>
      <p><strong>Gender:</strong> {selectedUser.gender}</p>
      <p><strong>Education:</strong> {selectedUser.education}</p>
      <p><strong>Job:</strong> {selectedUser.occupation}</p>
      <p><strong>Religion:</strong> {selectedUser.religion}</p>
      <p><strong>Caste:</strong> {selectedUser.caste}</p>
      <p><strong>Height:</strong> {selectedUser.height}</p>
      <p><strong>Country:</strong> {selectedUser.country}</p>
      <p><strong>Status:</strong> {selectedUser.status}</p>

      <button
        onClick={closeModal}
        className="mt-4 px-4 py-2 bg-[#5D4037] text-white rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default PendingForms;
