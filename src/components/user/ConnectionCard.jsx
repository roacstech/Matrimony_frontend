
import React, { useState, useEffect } from "react";
import {
  getVisibleConnections,
  getUserProfile,
  sendConnectionRequest,
} from "../../api/userApi";

import {
  Eye,
  MapPin,
  Briefcase,
  User,
  GraduationCap,
  FileText,
  X,
  Globe,
  Lock,
} from "lucide-react";

const ConnectionCard = () => {
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState("Public");
  const [selectedUser, setSelectedUser] = useState(null);
  const [myGender, setMyGender] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // Load connections
  useEffect(() => {
    async function loadData() {
      const res = await getVisibleConnections();
      if (res.success) setConnections(res.data);
    }
    loadData();
  }, []);
  useEffect(() => {
    async function loadMyGender() {
      const res = await getUserProfile();
      if (res.success) {
        setMyGender(res.data.gender);
      }
    }
    loadMyGender();
  }, []);

  // tost define

  const [toast, setToast] = useState({
    show: false,
    msg: "",
  });

  const handleViewProfile = async (userId) => {
    try {
      const res = await getUserProfile(userId);
      if (res.success) {
        setSelectedUser(res.data);
      } else {
        alert(res.message || "Profile not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // tost declarre

  const triggerToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2000);
  };

  const handleConnect = async (toUserId) => {
    try {
      const res = await sendConnectionRequest(toUserId);
      triggerToast(res.message || "Request sent");
    } catch (err) {
      console.error(err);
      triggerToast("Something went wrong");
    }
  };
  // ✅ ADDED (SEPARATE GENDER FILTER FUNCTION)
  const genderFilter = (profileGender) => {
    if (!myGender) return true;
    if (myGender === "Male" && profileGender === "Female") return true;
    if (myGender === "Female" && profileGender === "Male") return true;
    return false;
  };

  return (
    <div className="p-2 sm:p-4 bg-transparent space-y-10 font-serif">
      <Toaster position="top-right" reverseOrder={false} />

      {/* ================= TAB HEADER ================= */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab("Public")}
          className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-[2px] uppercase transition-all duration-300 ${
            activeTab === "Public"
              ? "bg-[#5D4037] text-white shadow-xl -translate-y-0.5"
              : "bg-white text-gray-400 border border-[#EEEEEE]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Globe size={14} /> Public
          </span>
        </button>

        <button
          onClick={() => setActiveTab("Private")}
          className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-[2px] uppercase transition-all duration-300 ${
            activeTab === "Private"
              ? "bg-[#5D4037] text-white shadow-xl -translate-y-0.5"
              : "bg-white text-gray-400 border border-[#EEEEEE]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Lock size={14} /> Private
          </span>
        </button>
      </div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-7xl mx-auto">
        {connections
          .filter(
            (u) => {
              if (u.privacy !== activeTab) return false;
              if (!genderFilter(u.gender)) return false; // ✅ ONLY LOGIC CHANGE
              return true;
            },
            ////tost jsx
          )

          .map((u) => (
            <div
              key={u.id}
              className="group relative bg-white rounded-[32px] border border-[#EEEEEE] shadow-sm hover:shadow-2xl hover:border-[#A67C52]/30 transition-all duration-500 flex flex-col w-full max-w-[310px] h-fit pt-12 pb-6 px-6 overflow-visible"
            >
              {/* 👁 EYE ICON */}
              {u.privacy === "Public" && (
                <button
                  onClick={() => handleViewProfile(u.user_id)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-[#FAF6F3] text-[#5D4037] shadow-sm 
                             hover:bg-[#5D4037] hover:text-white transition-all duration-300"
                >
                  <Eye size={16} />
                </button>
              )}

              {/* FLOATING STATUS BADGE */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-md border border-white transition-transform group-hover:scale-105"
                style={{
                  backgroundColor:
                    u.visibility === "Public" ? "#FAF6F3" : "#EEEEEE",
                  color: "#5D4037",
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-[1.5px] whitespace-nowrap leading-none">
                  {u.privacy === "Public"
                    ? "📡 Public Mode"
                    : "🔐 Private Mode"}
                </span>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-y-8 gap-x-10 mt-2">
                <DetailItem icon="🌙" label="Raasi" value={u.raasi} />
                <DetailItem
                  icon={u.gender === "Male" ? "👨" : "👩"}
                  label="Gender"
                  value={u.gender}
                />

                <DetailItem icon="💰" label="Salary" value={u.income} />
                <DetailItem icon="💼" label="Work" value={u.occupation} isAccent />
                <DetailItem icon="📍" label="Location" value={u.city} />
              </div>

              {/* ACTION BUTTON */}
              {u.privacy === "Private" && (
                <div className="mt-8 pt-5 border-t border-dashed border-[#EEEEEE]">
                  <button
                    onClick={() => handleConnect(u.id)}
                    className="w-full bg-[#5D4037] text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[2px] hover:bg-[#4a332c] transition-all transform active:scale-[0.96] shadow-lg shadow-stone-200"
                  >
                    Connect Now
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* ================= VIEW USER POPUP ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-[#5D4037]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-[650px]  overflow-y-auto shadow-2xl border border-[#EEEEEE]">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6  p-2 bg-[#5D4037] rounded-full text-white  transition-all"
            >
              <X size={20} />
            </button>

            {/* HEADER SECTION */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={selectedUser.photo || "https://i.pravatar.cc/300"}
                  alt=""
                  className="w-28 h-28 rounded-[30px] shadow-xl border-4 border-[#FAF6F3] object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#A67C52] text-white p-2 rounded-lg shadow-lg">
                  <User size={16} />
                </div>
              </div>
              <h3 className="text-center font-black text-2xl text-[#5D4037] tracking-tight">
                {selectedUser.full_name}
              </h3>
              <p className="text-center text-[10px] text-[#A67C52] font-black uppercase tracking-[3px] mt-1">
                {selectedUser.occupation}
              </p>
              <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={12} /> {selectedUser.city}, {selectedUser.country}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Left Column */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#A67C52] uppercase tracking-[2px] mb-4 border-b border-[#FAF6F3] pb-1">
                  Personal Info
                </h4>
                <PopupDetail
                  label="Gender / பாலினம்"
                  value={selectedUser.gender}
                />
                <PopupDetail
                  label="DOB / பிறந்த தேதி"
                  value={selectedUser.dob}
                />
                {/* <PopupDetail
                  label="Birth Time / பிறப்பு நேரம்"
                  value={selectedUser.birth_time}
                /> */}
                <PopupDetail
                  label="Marital Status / திருமண நிலை"
                  value={selectedUser.marital_status}
                />
                <PopupDetail
                  label="Email / மின்னஞ்சல்"
                  value={selectedUser.email}
                />
                <PopupDetail
                  label="Income / வருமானம்"
                  value={selectedUser.income}
                />
                <PopupDetail
                  label="Birth Place / பிறந்த இடம்"
                  value={selectedUser.birth_place}
                />

                <div className="mt-4 pt-4 border-t border-[#FAF6F3]">
                  <p className="text-[10px] font-black text-[#5D4037] uppercase mb-1 flex items-center gap-2">
                    <GraduationCap size={14} /> Education / கல்வி
                  </p>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {selectedUser.education}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#A67C52] uppercase tracking-[2px] mb-4 border-b border-[#FAF6F3] pb-1">
                  Family & Astrology
                </h4>
                <PopupDetail
                  label="Father / தந்தை"
                  value={selectedUser.father_name}
                />
                <PopupDetail
                  label="Mother / அம்மா"
                  value={selectedUser.mother_name}
                />
                <PopupDetail
                  label="Grandfather / தாத்தா"
                  value={selectedUser.grandfather_name}
                />
                <PopupDetail
                  label="Grandmother / பாட்டி"
                  value={selectedUser.grandmother_name}
                />

                <PopupDetail
                  label="Siblings / உடன்பிறப்புகள்"
                  value={selectedUser.siblings}
                />

                <div className="mt-6 grid grid-cols-2 gap-3 bg-[#FAF6F3] p-4 rounded-2xl border border-[#EEEEEE]">
                  <div>
                    <p className="text-[9px] font-black text-[#A67C52] uppercase">
                      Raasi / இராசி
                    </p>
                    <p className="text-xs font-bold text-[#5D4037]">
                      {selectedUser.raasi}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#A67C52] uppercase">
                      Natchathiram / நட்சத்திரம்
                    </p>
                    <p className="text-xs font-bold text-[#5D4037]">
                      {selectedUser.star}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#A67C52] uppercase">
                      Dosham / தோஷாம்
                    </p>
                    <p className="text-xs font-bold text-[#5D4037]">
                      {selectedUser.dosham}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* JADHAGAM SECTION */}
            <div className="mt-10">
              {selectedUser.horoscope_uploaded ? (
                <div className="p-5 bg-[#FAF6F3] rounded-[24px] border border-[#EEEEEE] flex items-center justify-between group hover:border-[#A67C52] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-[#A67C52] shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#5D4037] uppercase tracking-wider">
                        📜 Horoscope / Jadhagam
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Ready to View
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/${selectedUser.horoscope_file_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 text-[9px] bg-[#5D4037] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#A67C52] transition-all shadow-md"
                  >
                    Download
                  </a>
                </div>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-[#EEEEEE] rounded-[24px]">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[2px]">
                    Horoscope Not Uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* 🔔 GLOBAL TOAST POPUP (CENTER) */}
      {toast.show && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center ml-60 pt-32">
          <div
            className="
        bg-[#5D4037] text-[#FAF6F3] font-bold 
        px-10 py-3 rounded-2xl shadow-2xl
        transform-gpu origin-center
        transition-all duration-300 ease-out
        scale-100 opacity-100
      "
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */
const PopupDetail = ({ label, value }) => (
  <div className="flex justify-between items-center py-1 border-b border-[#FAF6F3]">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </span>
    <span className="text-[11px] font-black text-[#5D4037]">{value}</span>
  </div>
);

const DetailItem = ({ icon, label, value, isAccent }) => (
  <div className="flex flex-col min-w-0 w-full">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="w-5 h-5 flex items-center justify-center bg-[#FAF6F3] rounded-md text-[12px]">{icon}</span>
      <span className="text-[9px] text-[#A67C52] uppercase font-black tracking-[0.15em] leading-none truncate">{label}</span>
    </div>
    <div className="ml-6">
      <span className={`text-[10px] font-black leading-tight block line-clamp-1 uppercase tracking-wider ${isAccent ? "text-[#5D4037]" : "text-gray-500"}`} title={value}>
        {value}
      </span>
    </div>
  </div>
);

export default ConnectionCard;
