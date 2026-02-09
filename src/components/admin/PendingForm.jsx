import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Check, X, MapPin, Mail, User } from "lucide-react";

const PendingForms = () => {
  const [pending, setPending] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Modal user

  // ================= LOAD PENDING USERS =================
useEffect(() => {
  const loadPending = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/forms/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      // Ensure it's always an array
      setPending(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.error("Failed to load pending requests", error);
      toast.error("Failed to load pending requests");
    }
  };
  loadPending();
}, []);


  // ================= APPROVE USER =================
  const handleAccept = async (item) => {
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`http://localhost:5000/api/admin/approve/${item.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      toast.success("User approved & mail sent ✅", {
        position: "top-center",
      });
    } catch (error) {
      console.error(error);
      toast.error("Approval failed ❌", { position: "top-center" });
    }
  };

  // ================= REJECT USER =================
  const handleReject = async (item) => {
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`http://localhost:5000/api/admin/reject/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Profile incomplete" }),
      });
      setPending((prev) => prev.filter((p) => p.id !== item.id));
      toast.error("User rejected ❌", { position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Rejection failed ❌", { position: "top-center" });
    }
  };

  // ================= MODAL =================
  const handleView = (item) => setSelectedUser(item);
  const closeModal = () => setSelectedUser(null);

  if (pending.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-[30px] border border-[#EEEEEE] shadow-sm">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
          No Pending Requests
        </p>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER */}
      <div className="flex flex-col gap-1 ml-2">
        <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight">
          Pending User Requests
        </h2>
        <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
          Review new profile submissions
        </p>
      </div>

      {/* PENDING LIST */}
      <div className="grid gap-4">
        {pending.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#EEEEEE] rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6F3] flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={item.profile?.photo || "https://i.pravatar.cc/150?u=placeholder"}
                  alt={item.profile?.fullName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[15px] font-black text-[#5D4037] leading-none mb-2">
                  {item.profile?.fullName || "N/A"}
                </p>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 lowercase">
                    <Mail size={12} className="text-[#A67C52]" /> {item.email}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 uppercase tracking-tight">
                    <MapPin size={12} className="text-[#A67C52]" />{" "}
                    {item.profile?.city}, {item.profile?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
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

              <button
                onClick={() => handleView(item)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-[#5D4037] border border-[#A67C52] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FAEBCF] transition-all"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-[#FAF6F3] rounded-full text-[#5D4037] hover:bg-[#5D4037] hover:text-white transition-all"
            >
              X
            </button>

            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <img
                src={selectedUser.profile?.photo || "https://i.pravatar.cc/150?u=placeholder"}
                alt={selectedUser.profile?.fullName || "User"}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-[#FAF6F3] shadow-md"
              />
            </div>

            <h2 className="text-lg font-black text-[#5D4037] mb-2 text-center">
              {selectedUser.profile?.fullName || "N/A"}
            </h2>

            <p className="text-[10px] text-stone-400 text-center mb-4 uppercase tracking-wide">
              {selectedUser.profile?.city}, {selectedUser.profile?.country}
            </p>

            <div className="space-y-2 text-[12px]">
              <p>
                <span className="font-bold">Email:</span> {selectedUser.email || "N/A"}
              </p>
              <p>
                <span className="font-bold">Phone:</span> {selectedUser.phone || "N/A"}
              </p>
              <p>
                <span className="font-bold">Status:</span> {selectedUser.status || "N/A"}
              </p>
              <p>
                <span className="font-bold">Role ID:</span> {selectedUser.roleid || "N/A"}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full px-4 py-2 bg-[#5D4037] text-white rounded-lg font-black uppercase tracking-wide hover:bg-[#4a332c] transition-all"
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


// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Check, X, MapPin, Mail, User } from "lucide-react";

// // ✅ API functions import
// import {
//   getPendingForms,
//   approveUser,
//   rejectUser,
// } from "../../api/adminApi";

// const PendingForms = () => {
//   const [pending, setPending] = useState([]);

//   // LOAD PENDING (cleaned)
//   useEffect(() => {
//     const loadPending = async () => {
//       try {
//         const users = await getPendingForms();
//         setPending(users);
//       } catch (error) {
//         console.error("Failed to load pending requests", error);
//       }
//     };

//     loadPending();
//   }, []);

//   // ✅ APPROVE (cleaned)
//   const handleAccept = async (item) => {
//     try {
//       await approveUser(item.id);
//       setPending((prev) => prev.filter((p) => p.id !== item.id));
//       toast.success("User approved & mail sent ✅");
//     } catch {
//       toast.error("Approval failed");
//     }
//   };

//   // ❌ REJECT (cleaned)
//   const handleReject = async (item) => {
//     try {
//       await rejectUser(item.id);
//       setPending((prev) => prev.filter((p) => p.id !== item.id));
//       toast.error("User rejected ❌");
//     } catch {
//       toast.error("Rejection failed");
//     }
//   };

//   if (pending.length === 0) {
//     return (
//       <div className="p-10 text-center bg-white rounded-[30px] border border-[#EEEEEE] shadow-sm">
//         <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
//           No Pending Requests
//         </p>
//       </div>
//     );
//   }
//   const handleView = (item) => {
//   setSelectedUser(item);
// };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-1 ml-2">
//         <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight">
//           Pending User Requests
//         </h2>
//         <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
//           Review new profile submissions
//         </p>
//       </div>

//       <div className="grid gap-4">
//         {pending.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white border border-[#EEEEEE] rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm hover:shadow-md transition-shadow"
//           >
//             {/* USER INFO */}
//             <div className="flex items-center gap-5">
//               <div className="w-14 h-14 rounded-2xl bg-[#FAF6F3] flex items-center justify-center text-[#A67C52] flex-shrink-0">
//                 <User size={24} />
//               </div>
//               <div>
//                 <p className="text-[15px] font-black text-[#5D4037] leading-none mb-2">
//                   {item.profile?.full_name || "N/A"}
//                 </p>
//                 <div className="flex flex-col gap-1">
//                   <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 lowercase">
//                     <Mail size={12} className="text-[#A67C52]" /> {item.email}
//                   </p>
//                   <p className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 uppercase tracking-tight">
//                     <MapPin size={12} className="text-[#A67C52]" />{" "}
//                     {item.profile?.city}, {item.profile?.country}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => handleAccept(item)}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#5D4037] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
//               >
//                 <Check size={14} /> Accept
//               </button>

//               <button
//                 onClick={() => handleReject(item)}
//                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#FAF6F3] text-rose-500 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
//               >
//                 <X size={14} /> Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PendingForms;

