import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

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
import { getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";
const Img_Url = import.meta.env.VITE_IMG_URL;

const ConnectionCard = () => {
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState("Public");
  const [selectedUser, setSelectedUser] = useState(null);
  const [myGender, setMyGender] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const displayMode = "both"; 
// "tamil" or "both"

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


  const handleConnect = async (toUserId) => {
  try {
    const res = await sendConnectionRequest(toUserId);
    toast.success(res.message || "Request sent");

    if (res.success) {
      // re-fetch connections so UI updates immediately
      const updated = await getVisibleConnections();
      if (updated.success) setConnections(updated.data);
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};




  const genderFilter = (profileGender) => {
    if (!myGender) return true;
    if (myGender === "Male" && profileGender === "Female") return true;
    if (myGender === "Female" && profileGender === "Male") return true;
    return false;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-transparent space-y-6 sm:space-y-10 font-serif overflow-x-hidden">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      {/* ================= TAB HEADER ================= */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab("Public")}
          className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-2.5 rounded-full text-[10px] font-black tracking-[2px] uppercase transition-all duration-300 ${
            activeTab === "Public"
              ? "bg-[#1A5AF0] text-white shadow-xl -translate-y-0.5"
              : "bg-white text-gray-400 border border-[#EEEEEE]"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Globe size={14} /> Public
          </span>
        </button>

        <button
          onClick={() => setActiveTab("Private")}
          className={`flex-1 sm:flex-none whitespace-nowrap px-6 sm:px-8 py-2.5 rounded-full text-[10px] font-black tracking-[2px] uppercase transition-all duration-300 ${
            activeTab === "Private"
              ? "bg-[#1A5AF0] text-white shadow-xl -translate-y-0.5"
              : "bg-white text-gray-400 border border-[#EEEEEE]"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Lock size={14} /> Private
          </span>
        </button>
      </div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8  max-w-8xl md:max-w-6xl mx-auto">
     {connections
.filter((u) => {

  // 👶 inactive user hide (users table)
  if (u.is_active !== 1) return false;
  // or: if (u.status !== "ACTIVE") return false;

  if (u.privacy !== activeTab) return false;
  if (!genderFilter(u.gender)) return false;

  return true;
})
  .map((u) => (
            <div
              key={u.id}
                 
              className="group relative bg-white rounded-[32px] border border-[#EEEEEE] shadow-sm hover:shadow-2xl hover:border-[#1A5AF0]/30 transition-all duration-500 flex flex-col w-full msm:max-w-[420px]
lg:max-w-[480px]
xl:max-w-[520px]  h-fit pt-12 pb-6 px-5 sm:px-6"
            >
              {/* 👁 EYE ICON */}
            

              {/* FLOATING STATUS BADGE */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-md border border-white transition-transform group-hover:scale-105"
                style={{
                  backgroundColor:
                    u.privacy === "Public" ? "#EFF6FF" : "#F3F4F6",
                  color: "#1A5AF0",
                }}
              >
                <span className="text-[9px] font-black uppercase tracking-[1.5px] whitespace-nowrap leading-none">
                  {u.privacy === "Public"
                    ? "📡 Public Mode"
                    : "🔐 Private Mode"}
                </span>
              </div>

              {/* DETAILS GRID */}

                <div className=""> 
               <DetailItem
  icon="🌙"
  label="Raasi / இராசி"
  value={getEnumLabel("raasi", u.raasi, displayMode)}
/>

<DetailItem
  icon={u.gender === "Male" ? "👨" : "👩"}
  label="Gender / பாலினம்"
  value={getEnumLabel("gender", u.gender, displayMode)}
/>
<DetailItem
  icon="🎂"
  label="Age / வயது"
  value={u.dob ? `${calculateAge(u.dob)} Years` : "---"}
/>
                <DetailItem icon="💰" label="Salary / மாத வருமானம்" value={u.income} />
                <DetailItem
                  icon="💼"
                  label="Work / தொழில்"
                  value={u.occupation}
                  isAccent
                />
                  <DetailItem
                  icon="📍"
                  label="Worklocation / வேலை இடம்"
                  value={u.workLocation}
                  isAccent
                />
            

                {/* Location Spanning properly */}
                <div className="col-span-1">
                  <DetailItem icon="📍" label=" Home Location /  வீட்டு முகவரி" value={u.city} />
                </div>
              </div> 


{u.privacy === "Public" && (
  <button
    onClick={() => handleViewProfile(u.user_id)}
    className="mt-6 w-full py-4 bg-[#1A5AF0] text-white text-[12px] font-black uppercase tracking-[2px] rounded-[24px] hover:bg-[#1e40af] transition-all shadow-md block"
  >
    View Profile
  </button>
)}
              {/* ACTION BUTTON */}
{u.privacy === "Private" && (
  <div className="mt-8 pt-5 border-t border-dashed border-[#EEEEEE]">
    {/* NOT SENT */}
    {u.connection_status === "Not Sent" && (
      <button
        onClick={() => handleConnect(u.id)}
        className="w-full bg-[#1A5AF0] text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[2px] hover:bg-[#1e40af] transition-all shadow-lg"
      >
        Connect Now
      </button>
    )}

    {/* SENT */}
    {u.connection_status === "Sent" && (
      <button
        disabled
        className="w-full bg-gray-400 text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[2px] cursor-not-allowed"
      >
        Request Sent
      </button>
    )}

    {/* ✅ ACCEPTED → VIEW PROFILE */}
    {u.connection_status === "Accepted" && (
      <button
        onClick={() => handleViewProfile(u.user_id)}
        className="w-full bg-[#1A5AF0] text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[2px] hover:bg-[#1e40af] transition-all shadow-lg"
      >
        View Profile
      </button>
    )}

    {/* REJECTED */}
    {u.connection_status === "Rejected" && (
      <button
        disabled
        className="w-full bg-red-400 text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[2px] cursor-not-allowed"
      >
        Rejected
      </button>
    )}
  </div>
)}

            </div>
          ))}
      </div>

      {/* ================= VIEW USER POPUP ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-4">
          <div className="relative bg-white rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 w-full max-w-[650px] max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EEEEEE]">
            <button
              onClick={() => setSelectedUser(null)}
              className="sticky top-0 float-right z-10 p-2 bg-[#1A5AF0] rounded-full text-white hover:bg-[#111827] transition-all mb-2"
            >
              <X size={18} />
            </button>

            {/* HEADER SECTION */}
            <div className="flex flex-col items-center mb-8 clear-both">
              <div className="relative mb-4">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-[25px] sm:rounded-[30px] shadow-xl border-4 border-[#F8FAFC] object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#111827] text-white p-2 rounded-lg shadow-lg">
                  <User size={16} />
                </div>
              </div>
              <h3 className="text-center font-black text-xl sm:text-2xl text-[#111827] tracking-tight px-2">
                {selectedUser.full_name}
              </h3>
              {/* <p className="text-center text-[9px] sm:text-[10px] text-[#1A5AF0] font-black uppercase tracking-[2px] sm:tracking-[3px] mt-1">
                {selectedUser.occupation}
              </p> */}
             <p className="text-center text-[10px] text-[#1A5AF0] mt-2 uppercase tracking-widest flex items-center justify-center gap-1">
  <MapPin size={12} /> {selectedUser.city}, {selectedUser.country}
</p>
 <p className="text-center font-black  sm:text-1xl text-gray-400 tracking-tight px-2">
                {selectedUser.email}
              </p>
            </div>
              

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column */}
              <div className="space-y-6 w-full"> {/* Parent Container */}
  <div>
    <h4 className="text-[10px] font-black text-[#1A5AF0] uppercase tracking-[2px] mb-4 border-b border-[#F8FAFC] pb-1">
      Personal Info
    </h4>

    {/* This is the magic part: 1 column on mobile, 2 columns on large screens */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
      <PopupDetail
        label="Gender / பாலினம்"
        value={getEnumLabel("gender", selectedUser.gender, displayMode)}
      />
      <PopupDetail
        label="DOB / பிறந்த தேதி"
        value={selectedUser?.dob ? new Date(selectedUser.dob).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
      />
      <PopupDetail
        label="Age / வயது"
        value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"}
      />
      <PopupDetail
        label="Birth Place / பிறந்த இடம்"
        value={selectedUser.birth_place}
      />
      <PopupDetail
        label="Birth Time / பிறந்த நேரம்"
        value={selectedUser?.birth_time ? new Date(`1970-01-01T${selectedUser.birth_time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—"}
      />
      <PopupDetail
        label="Marital Status / திருமண நிலை"
        value={getEnumLabel("maritalStatus", selectedUser.marital_status, displayMode)}
      />
      <PopupDetail
        label="Email / மின்னஞ்சல்"
        value={selectedUser.email}
      />
      <PopupDetail
        label="Phone Number / தொலைபேசி எண்"
        value={selectedUser.phone}
      />
      <PopupDetail
        label="Occupation / தொழில்"
        value={selectedUser.occupation}
      />
      <PopupDetail
        label="Income / வருமானம்"
        value={selectedUser.income}
      />
      <PopupDetail
        label="Work Location / வேலை இடம்"
        value={selectedUser.work_location}
      />
    </div>
  </div>

  {/* Education Section */}
  <div className="mt-4 pt-4 border-t border-[#F8FAFC]">
    <p className="text-[10px] font-black text-[#111827] uppercase mb-1 flex items-center gap-2">
      <GraduationCap size={14} /> Education / கல்வி
    </p>
    <p className="text-xs text-gray-500 font-medium leading-relaxed">
      {selectedUser.education}
    </p>
  </div>
</div>

              {/* Right Column */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#1A5AF0] uppercase tracking-[2px] mb-4 border-b border-[#F8FAFC] pb-1">
                  Family & Details
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
                  label="Mother Side Grandfather Name / தாய்வழி தாத்தா பெயர்"
                  value={selectedUser.mother_side_grandfather_name}
                />
                       <PopupDetail
                  label="Mother Side Grandmother Name / தாய்வழி பாட்டி பெயர்"
                  value={selectedUser.mother_side_grandmother_name}
                />
                <PopupDetail
                  label="Siblings / உடன்பிறப்புகள்"
                  value={selectedUser.siblings}
                />

                <div className="mt-6 grid grid-cols-2 gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#EEEEEE]">
                  <div>
                    <p className="text-[9px] font-black text-[#1A5AF0] uppercase">
                      Raasi
                    </p>
                    <p className="text-[11px] font-bold text-[#111827]">
                      {getEnumLabel("raasi", selectedUser.raasi, displayMode)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#1A5AF0] uppercase">
                      Star
                    </p>
                    <p className="text-[11px] font-bold text-[#111827]">
                      {getEnumLabel("star", selectedUser.star, displayMode)}
                    </p>
                  </div>
                  <div className="col-span-2 mt-1">
                    <p className="text-[9px] font-black text-[#1A5AF0] uppercase">
                      Dosham
                    </p>
                    <p className="text-[11px] font-bold text-[#111827]">
                      {getEnumLabel("dosham", selectedUser.dosham, displayMode)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* JADHAGAM SECTION */}
            <div className="mt-10">
              {selectedUser.horoscope_uploaded ? (
                <div className="p-4 sm:p-5 bg-[#F8FAFC] rounded-[24px] border border-[#EEEEEE] flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-[#1A5AF0] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-[#1A5AF0] shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#111827] uppercase tracking-wider">
                        📜 Horoscope / Jadhagam
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope_file_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto text-center px-6 py-2.5 text-[9px] bg-[#1A5AF0] text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-md"
                  >
                    View
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

      {/* 🔔 GLOBAL TOAST POPUP (MOBILE OPTIMIZED) */}
      {toast.show && (
        <div className="fixed bottom-10 left-0 right-0 z-[9999] flex justify-center px-4 sm:bottom-auto sm:top-32 sm:ml-60">
          <div className="bg-[#111827] text-[#FAF6F3] font-bold px-6 sm:px-10 py-3 rounded-2xl shadow-2xl text-center transform-gpu scale-100 opacity-100 transition-all duration-300">
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */
const PopupDetail = ({ label, value }) => (
  <div className="flex justify-between items-start py-1.5 border-b border-[#F8FAFC] gap-4">
    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[100px]">
      {label}
    </span>
    <span className="text-[10px] sm:text-[11px] font-black text-[#111827] text-right">
      {value || "N/A"}
    </span>
  </div>
);

const DetailItem = ({ icon, label, value, isAccent }) => (
  <div className="flex flex-col min-w-0 w-full">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#F8FAFC] rounded-md text-[12px]">
        {icon}
      </span>
      <span className="text-[8px] sm:text-[9px] text-[#111827] uppercase font-black tracking-[0.1em] leading-none truncate">
        {label}
      </span>
    </div>
    <div className="ml-6">
      <span
        className={`text-[10px] font-black leading-tight block truncate uppercase tracking-wider ${isAccent ? "text-[#1A5AF0]" : "text-gray-500"}`}
        title={value}
      >
        {value || "---"}
      </span>
    </div>
  </div>
);

export default ConnectionCard;