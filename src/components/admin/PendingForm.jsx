import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, MapPin, Mail, User } from "lucide-react";

const PendingForms = () => {
  const [pending, setPending] = useState([]);

  // LOAD PENDING
  useEffect(() => {
    const loadPending = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/forms/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setPending(data);
      } catch (error) {
        console.error("Failed to load pending requests", error);
      }
    };

    loadPending();
  }, []);

  // ✅ APPROVE
  const handleAccept = async (item) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(
        `http://localhost:5000/api/admin/approve/${item.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local state to remove approved item
      setPending(prev => prev.filter(p => p.id !== item.id));
      toast.success("User approved & mail sent ✅");
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  // ❌ REJECT
  const handleReject = async (item) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(
        `http://localhost:5000/api/admin/reject/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: "Profile incomplete" }),
        }
      );

      // Update local state to remove rejected item
      setPending(prev => prev.filter(p => p.id !== item.id));
      toast.error("User rejected ❌");
    } catch (error) {
      toast.error("Rejection failed");
    }
  };

  if (pending.length === 0) {
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
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight">
          Pending User Requests
        </h2>
        <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
          Review new profile submissions
        </p>
      </div>

      <div className="grid gap-4">
        {pending.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#EEEEEE] rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6F3] flex items-center justify-center text-[#A67C52] flex-shrink-0">
                <User size={24} />
              </div>
              <div>
                <p className="text-[15px] font-black text-[#5D4037] leading-none mb-2">
                  {item.profile.fullName}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 lowercase">
                    <Mail size={12} className="text-[#A67C52]" /> {item.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 uppercase tracking-tight">
                    <MapPin size={12} className="text-[#A67C52]" /> {item.profile.city}, {item.profile.country}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAccept(item)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingForms;