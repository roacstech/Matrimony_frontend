import React, { useState, useEffect } from "react";
import {
  Eye,
  ArrowLeft,
  FileText,
  Download,
  Mail,
  MapPin,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { calculateAge } from "../../utils/dateHelper";
import { getAllUsers, adminToggleVisibility } from "../../api/adminApi";
import { getEnumLabel } from "../../utils/convertHelper";

//update
const AllUsers = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [togglingUserId, setTogglingUserId] = useState(null);

  const displayMode = "both"; 

  //* ================= FETCH USERS ================= */
  useEffect(() => {
    getAllUsers()
      .then((res) => {
        const fixedData = res.map((u) => ({
          ...u,
          is_active: Number(u.is_active),
        }));
        setData(fixedData);
      })
      .catch(console.error);
  }, []);

  /* ================= TOGGLE VISIBILITY ================= */
  const togglePublicStatus = async (id, currentStatus) => {
    setTogglingUserId(id);
    try {
      const res = await adminToggleVisibility({
        id,
        key: currentStatus === 1 ? 0 : 1,
      });

      if (res.success) {
        setData((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, is_active: Number(res.is_active) } : u,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingUserId(null);
    }
  };

  const formatTime12h = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    let hours = Number(h);
    const minutes = m;
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = data.filter((u) => {
    if (filter === "all") return true;
    if (filter === "male" || filter === "female")
      return u.gender?.toLowerCase() === filter;
    if (filter === "active") return u.is_active === 1;
    if (filter === "inactive") return u.is_active === 0;
    return true;
  });

  /* ================= 1. PROFILE DETAIL VIEW ================= */
  if (selectedUser) {
    return (
      <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-right-5 duration-500">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 w-full lg:w-auto">
            <button
              onClick={() => {
                setSelectedUser(null);
                setActiveTab("personal");
              }}
              className="p-3.5 md:p-4 bg-blue-50 text-[#1A5AF0] rounded-[20px] md:rounded-[24px] hover:bg-[#1A5AF0] hover:text-white transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[28px] bg-[#1A5AF0] overflow-hidden border-4 border-blue-50 shadow-md flex items-center justify-center flex-shrink-0">
                {selectedUser?.photo ? (
                  <img
                    src={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.photo}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white font-black text-xl">
                    {selectedUser?.fullName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-black tracking-tight leading-tight">
                  {selectedUser.fullName}
                </h2>
                <div className="flex flex-col gap-0.5 mt-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-[#1A5AF0] uppercase tracking-wider">
                    <MapPin size={12} /> {selectedUser.city}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 lowercase">
                    <Mail size={12} /> {selectedUser.email || "user@mail.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 w-full lg:w-auto justify-center lg:justify-start ${selectedUser.is_active ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-500"}`}
          >
            {selectedUser.is_active ? (
              <ShieldCheck size={18} />
            ) : (
              <ShieldAlert size={18} />
            )}
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                {selectedUser.is_active ? "Active Profile" : "Private Profile"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar border-b border-gray-100 -mx-5 px-5 md:mx-0 md:px-0">
          {["personal", "education", "family", "horoscope"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-t-[15px] md:rounded-t-[20px] text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? "bg-[#1A5AF0] text-white shadow-lg" : "text-gray-400 hover:text-[#1A5AF0]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
          {activeTab === "personal" && (
            <>
              <InfoBox label="Full Name/ முழு பெயர்" value={selectedUser.fullName} />
              <InfoBox label="Gender/ பாலினம்" value={getEnumLabel("gender", selectedUser.gender, displayMode)} /> 
              <InfoBox label="Date of Birth / பிறந்த தேதி" value={selectedUser.dob?.split("T")[0]} />
              <InfoBox label="Age / வயது" value={selectedUser?.dob ? `${calculateAge(selectedUser.dob)} Years` : "—"} />
              <InfoBox label="Birth Place / பிறந்த இடம்" value={selectedUser.birthPlace} />
              <InfoBox label="Birth Time / பிறந்த நேரம்" value={formatTime12h(selectedUser.birthTime)} />
              <InfoBox label="Phone Number / தொலைபேசி எண்" value={selectedUser.phone} />
              <InfoBox label="Marital Status / திருமண நிலை" value={getEnumLabel("maritalStatus", selectedUser.maritalStatus, displayMode)} />
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoBox label="Full Address/ வீட்டு முகவரி" value={selectedUser.address} />
              </div>
            </>
          )}

          {activeTab === "education" && (
            <>
              <InfoBox label="Qualification/ கல்வி" value={selectedUser.education} />
              <InfoBox label="Job / Occupation / தொழில்" value={selectedUser.occupation} />
              <InfoBox label="Annual Income/மாத வருமானம்" value={selectedUser.income} />
              <InfoBox label="Work Location / வேலை இடம்" value={selectedUser.workLocation} />
            </>
          )}

          {activeTab === "family" && (
            <>
              <InfoBox label="Father's Name/ தந்தை பெயர்" value={selectedUser.father} />
              <InfoBox label="Mother's Name/ தாய் பெயர்" value={selectedUser.mother} />
              <InfoBox label="Paternal Grandfather/ தாத்தா பெயர்" value={selectedUser.grandfather} />
              <InfoBox label="Paternal Grandmother/ பாட்டி பெயர்" value={selectedUser.grandmother} />
              <InfoBox label="Mother Side Grandfather / தாய்வழி தாத்தா பெயர்" value={selectedUser.motherSideGrandfather} />
              <InfoBox label="Mother Side Grandmother / தாய்வழி பாட்டி பெயர்" value={selectedUser.motherSideGrandmother} />
              <InfoBox label="Siblings/ உடன்பிறப்புகள்" value={selectedUser.siblings} />
            </>
          )}

          {activeTab === "horoscope" && (
            <>
              <InfoBox label="Raasi / இராசி" value={getEnumLabel("raasi", selectedUser.raasi, displayMode)} />
              <InfoBox label="Star / நட்சத்திரம்" value={getEnumLabel("star", selectedUser.star, displayMode)} />
              <InfoBox label="Dosham / தோஷாம்" value={getEnumLabel("dosham", selectedUser.dosham, displayMode)} />
              <div className="sm:col-span-2 lg:col-span-3 mt-4">
                <div className="p-5 md:p-6 bg-blue-50/50 border border-blue-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-[#1A5AF0] flex-shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jadhagam File/ ஜாதகம்</p>
                      <p className="text-sm font-bold text-black truncate max-w-[150px] sm:max-w-xs">
                        {selectedUser.horoscope?.uploaded ? selectedUser.horoscope.fileName || "horoscope.pdf" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  {selectedUser.horoscope?.uploaded && (
                    <a
                      href={`${import.meta.env.VITE_IMG_URL}/photos/${selectedUser.horoscope.fileName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 bg-[#1A5AF0] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Download size={14} /> View
                    </a>
                  )} 
                </div>
                <div className="mt-4">
                  <InfoBox label="Remarks / குறிப்புகள்" value={selectedUser.remarks} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ================= 2. TABLE VIEW ================= */
  return (
    <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="text-center xl:text-left">
          <h2 className="text-xl md:text-2xl font-black text-black tracking-tight">User Records</h2>
        </div>
        <div className="flex bg-blue-50/50 p-1.5 rounded-[22px] border border-blue-100 overflow-x-auto no-scrollbar max-w-full">
          {["all", "male", "female", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase rounded-[18px] transition-all whitespace-nowrap ${filter === f ? "bg-white text-[#1A5AF0] shadow-sm" : "text-gray-400 hover:text-[#1A5AF0]"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-blue-50/30 text-[10px] font-black text-gray-400 uppercase tracking-[2px] border-b border-gray-100">
              <th className="px-6 md:px-8 py-5">Profile Details</th>
              <th className="px-6 md:px-8 py-5">Profession</th>
              <th className="px-6 md:px-8 py-5">Privacy</th>
              <th className="px-6 md:px-8 py-5 text-center">Visibility</th>
              <th className="px-6 md:px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="group hover:bg-blue-50/20 transition-all">
                <td className="px-6 md:px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-[16px] md:rounded-[18px] bg-[#1A5AF0] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {u?.photo ? (
                        <img src={`${import.meta.env.VITE_IMG_URL}/photos/${u.photo}`} alt="user" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-white font-bold">{u?.fullName?.charAt(0).toUpperCase()}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] md:text-[14px] font-black text-black leading-none">{u.fullName}</p>
                      <p className="text-[9px] md:text-[10px] text-[#1A5AF0] font-bold uppercase tracking-widest mt-1.5">{u.gender} • {u.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <p className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{u.occupation}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black mt-1 tracking-tighter">{u.income}</p>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <p className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${u.privacy === "Private" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                    {u.privacy}
                  </p>
                </td>
                <td className="px-6 md:px-8 py-5 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => togglePublicStatus(u.id, u.is_active)}
                      className={`w-10 h-5 rounded-full relative transition-all ${u.is_active === 1 ? "bg-[#1A5AF0]" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${u.is_active ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${u.is_active ? "text-[#1A5AF0]" : "text-gray-400"}`}>
                      {u.is_active === 1 ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5 text-center">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="p-2.5 md:p-3 text-[#1A5AF0] bg-blue-50 hover:bg-[#1A5AF0] hover:text-white rounded-xl md:rounded-2xl transition-all shadow-sm"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= INFOBOX COMPONENT ================= */
const InfoBox = ({ label, value }) => (
  <div className="flex flex-col gap-1.5 group">
    <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-[1.5px] ml-1 group-hover:text-[#1A5AF0] transition-colors">
      {label}
    </label>
    <div className="px-5 md:px-6 py-4 md:py-5 bg-gray-50/50 border border-gray-100 rounded-[20px] md:rounded-[24px] text-[12px] md:text-[13px] font-bold text-black group-hover:border-[#1A5AF0] group-hover:bg-white transition-all shadow-sm">
      {value || "—"}
    </div>
  </div>
);

export default AllUsers;