import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { GiStarFormation } from "react-icons/gi";
import {
  FaUser,
  FaGraduationCap,
  FaFileAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaBriefcase,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { X, Globe, Lock } from "lucide-react";

import {
  getVisibleConnections,
  getUserProfile,
  sendConnectionRequest,
} from "../../api/userApi";
import { getEnumLabel } from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";

const PRIMARY = "#4361EE";
const PRIMARY_LIGHT = "#EEF2FF";

const ConnectionCard = () => {
  const [connections, setConnections] = useState([]);
  const [activeTab, setActiveTab] = useState("Public");
  const [selectedUser, setSelectedUser] = useState(null);
  const [myGender, setMyGender] = useState(null);

  const displayMode = "both";

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
      if (res.success) setMyGender(res.data.gender);
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
    <div className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 bg-transparent space-y-5 sm:space-y-8 lg:space-y-10 font-sans overflow-x-hidden w-full min-h-screen">

      {/* ================= TABS ================= */}
      <div className="flex items-center">
        <span
          onClick={() => setActiveTab("Public")}
          className={`flex items-center gap-2 px-6 py-3 text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
            activeTab === "Public"
              ? "text-[#4361EE] border-b-3 border-[#4361EE] -mb-[2px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Globe size={14} /> Public
        </span>
        <span
          onClick={() => setActiveTab("Private")}
          className={`flex items-center gap-2 px-6 py-3 text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
            activeTab === "Private"
              ? "text-[#4361EE] border-b-3 border-[#4361EE] -mb-[2px]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Lock size={14} /> Private
        </span>
      </div>

      {/* ================= CARD GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 w-full md:max-w-6xl mx-auto">
        {connections
          .filter((u) => {
            if (u.is_active !== 1) return false;
            if (u.privacy !== activeTab) return false;
            if (!genderFilter(u.gender)) return false;
            return true;
          })
          .map((u) => (
            <div
              key={u.id}
              className="group relative bg-white rounded-xl border border-[#EEEEEE] shadow-sm hover:shadow-lg hover:border-[#4361EE]/30 transition-all duration-300 flex flex-col w-full h-fit pt-10 pb-5 px-5"
            >
              {/* FLOATING STATUS BADGE */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full shadow-sm border border-white"
                style={{
                  backgroundColor: u.privacy === "Public" ? PRIMARY_LIGHT : "#F3F4F6",
                  color: PRIMARY,
                }}
              >
                <span className="text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
                  {u.privacy === "Public" ? (
                    <><MdOutlinePublic size={11} /> Public Mode</>
                  ) : (
                    <><RiGitRepositoryPrivateFill size={11} /> Private Mode</>
                  )}
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-4">
                <DetailItem
                  icon={<GiStarFormation size={13} className="text-gray-700" />}
                  label="Raasi / இராசி"
                  value={getEnumLabel("raasi", u.raasi, displayMode)}
                />
                <DetailItem
                  icon={<FaVenusMars size={13} className="text-gray-700" />}
                  label="Gender / பாலினம்"
                  value={getEnumLabel("gender", u.gender, displayMode)}
                />
                <DetailItem
                  icon={<FaBirthdayCake size={13} className="text-gray-700" />}
                  label="Age / வயது"
                  value={u.dob ? `${calculateAge(u.dob)} Years` : "---"}
                />
                <DetailItem
                  icon={<FaMoneyBillWave size={13} className="text-gray-700" />}
                  label="Salary / மாத வருமானம்"
                  value={u.income}
                />
                <DetailItem
                  icon={<FaBriefcase size={13} className="text-gray-700" />}
                  label="Work / தொழில்"
                  value={u.occupation}
                  isAccent
                />
                <DetailItem
                  icon={<FaMapMarkerAlt size={13} className="text-gray-700" />}
                  label="Worklocation / வேலை இடம்"
                  value={u.workLocation}
                  isAccent
                />
                <DetailItem
                  icon={<FaHome size={13} className="text-gray-700" />}
                  label="Home Location / வீட்டு முகவரி"
                  value={u.city}
                />
              </div>

              {/* PUBLIC — VIEW PROFILE */}
              {u.privacy === "Public" && (
  <button
    onClick={() => handleViewProfile(u.user_id)}
    className="mt-6 w-full py-3 text-white text-[12px] font-semibold uppercase tracking-widest rounded-lg transition-all shadow-sm cursor-pointer"
    style={{ backgroundColor: PRIMARY }}
    onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
    onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
  >
    View Profile
  </button>
)}

              {/* PRIVATE — ACTION BUTTONS */}
              {u.privacy === "Private" && (
                <div className="mt-5 pt-4 border-t border-dashed border-[#EEEEEE]">
                  {u.connection_status === "Not Sent" && (
  <button
    onClick={() => handleConnect(u.id)}
    className="w-full cursor-pointer text-white py-3 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-all shadow-sm"
    style={{ backgroundColor: PRIMARY }}
  >
    Connect Now
  </button>
)}
                  {u.connection_status === "Sent" && (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg text-[11px] font-semibold uppercase tracking-widest cursor-not-allowed"
                    >
                      Request Sent
                    </button>
                  )}
                  {u.connection_status === "Accepted" && (
                    <button
                      onClick={() => handleViewProfile(u.user_id)}
                      className="w-full text-white py-3 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-all shadow-sm"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      View Profile
                    </button>
                  )}
                  {u.connection_status === "Rejected" && (
                    <button
                      disabled
                      className="w-full bg-red-100 text-red-400 py-3 rounded-lg text-[11px] font-semibold uppercase tracking-widest cursor-not-allowed"
                    >
                      Rejected
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* ================= VIEW PROFILE POPUP ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start xs:items-center justify-center z-[100] p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-xl p-5 sm:p-8 w-full sm:max-w-[650px] max-h-[92vh] overflow-y-auto shadow-2xl border border-[#EEEEEE] my-2">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedUser(null)}
              className="sticky top-0 float-right z-10 p-2 rounded-full text-white transition-all mb-2"
              style={{ backgroundColor: PRIMARY }}
            >
              <X size={16} />
            </button>

            {/* PROFILE HEADER */}
            <div className="flex flex-col items-center mb-6 clear-both">
              <div className="relative mb-4">
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl shadow-lg border-4 border-[#F8FAFC] object-cover"
                />
                <div
                  className="absolute -bottom-2 -right-2 text-white p-1.5 rounded-lg shadow"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <FaUser size={12} />
                </div>
              </div>
              <h3 className="text-center font-semibold text-xl sm:text-2xl text-gray-800 tracking-tight">
                {selectedUser.full_name}
              </h3>
              <p
                className="text-center text-[10px] mt-2 uppercase tracking-widest flex items-center gap-1"
                style={{ color: PRIMARY }}
              >
                <FaMapMarkerAlt size={11} /> {selectedUser.city}, {selectedUser.country}
              </p>
              <p className="text-center text-[11px] text-gray-400 mt-1">
                {selectedUser.email}
              </p>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

              {/* Left — Personal Info */}
              <div className="space-y-4">
                <h4
                  className="text-[10px] font-semibold uppercase tracking-[2px] border-b border-gray-100 pb-1"
                  style={{ color: PRIMARY }}
                >
                  Personal Info
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <PopupDetail
                    label="Gender / பாலினம்"
                    value={getEnumLabel("gender", selectedUser.gender, displayMode)}
                  />
                  <PopupDetail
                    label="DOB / பிறந்த தேதி"
                    value={
                      selectedUser?.dob
                        ? new Date(selectedUser.dob).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"
                    }
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
                    value={
                      selectedUser?.birth_time
                        ? new Date(`1970-01-01T${selectedUser.birth_time}`).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit", hour12: true }
                          )
                        : "—"
                    }
                  />
                  <PopupDetail
                    label="Marital Status / திருமண நிலை"
                    value={getEnumLabel("maritalStatus", selectedUser.marital_status, displayMode)}
                  />
                  <PopupDetail label="Email / மின்னஞ்சல்" value={selectedUser.email} />
                  <PopupDetail label="Phone / தொலைபேசி" value={selectedUser.phone} />
                  <PopupDetail label="Occupation / தொழில்" value={selectedUser.occupation} />
                  <PopupDetail label="Income / வருமானம்" value={selectedUser.income} />
                  <PopupDetail
                    label="Work Location / வேலை இடம்"
                    value={selectedUser.work_location}
                  />
                </div>

                {/* Education */}
                <div className="pt-3 border-t border-gray-100">
                  <p
                    className="text-[10px] font-semibold uppercase flex items-center gap-2 mb-1"
                    style={{ color: PRIMARY }}
                  >
                    <FaGraduationCap size={13} /> Education / கல்வி
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {selectedUser.education}
                  </p>
                </div>
              </div>

              {/* Right — Family & Details */}
              <div className="space-y-2">
                <h4
                  className="text-[10px] font-semibold uppercase tracking-[2px] border-b border-gray-100 pb-1 mb-3"
                  style={{ color: PRIMARY }}
                >
                  Family & Details
                </h4>
                <PopupDetail label="Father / தந்தை" value={selectedUser.father_name} />
                <PopupDetail label="Mother / அம்மா" value={selectedUser.mother_name} />
                <PopupDetail label="Grandfather / தாத்தா" value={selectedUser.grandfather_name} />
                <PopupDetail label="Grandmother / பாட்டி" value={selectedUser.grandmother_name} />
                <PopupDetail
                  label="Mother's Grandfather / தாய்வழி தாத்தா"
                  value={selectedUser.mother_side_grandfather_name}
                />
                <PopupDetail
                  label="Mother's Grandmother / தாய்வழி பாட்டி"
                  value={selectedUser.mother_side_grandmother_name}
                />
                <PopupDetail
                  label="Siblings / உடன்பிறப்புகள்"
                  value={selectedUser.siblings}
                />

                {/* Raasi / Star / Dosham */}
                <div className="mt-4 grid grid-cols-2 gap-3 bg-[#F8FAFC] p-4 rounded-lg border border-[#EEEEEE]">
                  <div>
                    <p
                      className="text-[9px] font-semibold uppercase mb-0.5"
                      style={{ color: PRIMARY }}
                    >
                      Raasi
                    </p>
                    <p className="text-[11px] font-medium text-gray-800">
                      {getEnumLabel("raasi", selectedUser.raasi, displayMode)}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[9px] font-semibold uppercase mb-0.5"
                      style={{ color: PRIMARY }}
                    >
                      Star
                    </p>
                    <p className="text-[11px] font-medium text-gray-800">
                      {getEnumLabel("star", selectedUser.star, displayMode)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className="text-[9px] font-semibold uppercase mb-0.5"
                      style={{ color: PRIMARY }}
                    >
                      Dosham
                    </p>
                    <p className="text-[11px] font-medium text-gray-800">
                      {getEnumLabel("dosham", selectedUser.dosham, displayMode)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HOROSCOPE SECTION */}
            <div className="mt-8">
              {selectedUser.horoscope_uploaded ? (
                <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#EEEEEE] flex flex-col xs:flex-row items-center justify-between gap-3 hover:border-[#4361EE] transition-all">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 bg-white rounded-lg shadow-sm"
                      style={{ color: PRIMARY }}
                    >
                      <FaFileAlt size={16} />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                      Horoscope / Jadhagam
                    </p>
                  </div>
                  <a
                    href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope_file_name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 text-[10px] text-white rounded-lg font-semibold uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    View
                  </a>
                </div>
              ) : (
                <div className="py-6 text-center border-2 border-dashed border-[#EEEEEE] rounded-lg">
                  <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">
                    Horoscope Not Uploaded
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const PopupDetail = ({ label, value }) => (
  <div className="flex flex-col py-1 border-b border-gray-50">
    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider leading-tight">
      {label}
    </span>
    <span className="text-[11px] font-semibold text-gray-800 leading-tight mt-0.5">
      {value || "N/A"}
    </span>
  </div>
);

const DetailItem = ({ icon, label, value, isAccent }) => (
  <div className="flex items-center gap-3 min-w-0 w-full">
    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-50 rounded-lg">
      {icon}
    </span>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] text-gray-400 uppercase font-medium tracking-wide leading-none truncate">
        {label}
      </span>
      <span
        className={`text-[11px] font-semibold leading-tight truncate mt-0.5 ${
          isAccent ? "text-[#4361EE]" : "text-gray-700"
        }`}
        title={value}
      >
        {value || "---"}
      </span>
    </div>
  </div>
);

export default ConnectionCard;