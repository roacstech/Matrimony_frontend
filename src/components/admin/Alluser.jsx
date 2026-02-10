import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/imageHelper";
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
import {
  getAllUsers,
  adminToggleVisibility,
} from "../../api/adminApi";

const AllUsers = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [togglingUserId, setTogglingUserId] = useState(null);

  /* ================= FETCH USERS ================= */
 useEffect(() => {
  getAllUsers()
    .then((res) => {
      const fixedData = res.map((u) => ({
        ...u,
        is_active: Number(u.is_active), // ✅ FORCE NUMBER
      }));
      setData(fixedData);
    })
    .catch(console.error);
}, []);
console.log("Get All User:",getAllUsers)


  /* ================= TOGGLE FUNCTION (NUMBER BASED) ================= */
  const togglePublicStatus = async (id, currentStatus) => {
    setTogglingUserId(id);

    try {
      const res = await adminToggleVisibility({
        id,
        key: currentStatus === 1 ? 0 : 1, // ✅ toggle 1 ↔ 0
      });

    if (res.success) {
  setData((prev) =>
    prev.map((u) =>
      u.id === id
        ? { ...u, is_active: Number(res.is_active) } 
        : u
    )
  );
}

    } catch (err) {
      console.error(err);
    } finally {
      setTogglingUserId(null);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredUsers = data.filter((u) => {
    console.log("PHOTO:", u.photo);
console.log("PHOTO URL:", getImageUrl(u.photo));

    if (filter === "all") return true;
    if (filter === "male" || filter === "female")
      return u.gender?.toLowerCase() === filter;
    if (filter === "active") return u.is_active === 1;
    if (filter === "inactive") return u.is_active === 0;
    return true;
  });

  console.log("Selected User",selectedUser)
  


  /* ================= 1. PROFILE DETAIL VIEW ================= */
  if (selectedUser) {
    return (
      <div className="bg-white rounded-[30px] md:rounded-[40px] p-5 md:p-10 shadow-xl border border-[#EEEEEE] animate-in fade-in slide-in-from-right-5 duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6 w-full lg:w-auto">
            <button onClick={() => { setSelectedUser(null); setActiveTab("personal"); }} 
              className="p-3.5 md:p-4 bg-[#FAF6F3] text-[#5D4037] rounded-[20px] md:rounded-[24px] hover:bg-[#5D4037] hover:text-white transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] md:rounded-[28px] bg-[#5D4037] overflow-hidden border-4 border-[#FAF6F3] shadow-md flex items-center justify-center flex-shrink-0">
                {selectedUser.photo ? (
                  <img
  src={`http://localhost:5000/uploads/photos/${u.photo}`}
  alt=""
/>


                ) : (
                  <span className="text-white text-2xl md:text-3xl font-black">{selectedUser.fullName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight leading-tight">{selectedUser.fullName}</h2>
                <div className="flex flex-col gap-0.5 mt-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-[#A67C52] uppercase tracking-wider">
                    <MapPin size={12} /> {selectedUser.city}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 lowercase">
                    <Mail size={12} /> {selectedUser.email || 'user@mail.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 w-full lg:w-auto justify-center lg:justify-start ${selectedUser.is_active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
             {selectedUser.is_active ? <ShieldCheck size={18}/> : <ShieldAlert size={18}/>}
             <div className="flex flex-col">
               <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                 {selectedUser.is_active ? 'Active Profile' : 'Private Profile'}
               </span>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar border-b border-[#EEEEEE] -mx-5 px-5 md:mx-0 md:px-0">
          {["personal", "education", "family", "horoscope"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-t-[15px] md:rounded-t-[20px] text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? "bg-[#5D4037] text-white shadow-lg" : "text-stone-400 hover:text-[#5D4037]"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
          {activeTab === "personal" && (
            <>
              <InfoBox label="Full Name" value={selectedUser.fullName} />
              <InfoBox label="Gender" value={selectedUser.gender} />
              <InfoBox label="Date of Birth" value={selectedUser.dob} />
              <InfoBox label="Birth Time" value={selectedUser.birthTime} />
              <InfoBox label="Marital Status" value={selectedUser.maritalStatus} />
              <InfoBox label="Religion" value={selectedUser.religion} />
              <InfoBox label="Caste" value={selectedUser.caste} />
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoBox label="Full Address" value={selectedUser.address} />
              </div>
            </>
          )}

          {activeTab === "education" && (
            <>
              <InfoBox label="Qualification" value={selectedUser.education} />
              <InfoBox label="Job / Occupation" value={selectedUser.occupation} />
              <InfoBox label="Annual Income" value={selectedUser.income} />
            </>
          )}

          {activeTab === "family" && (
            <>
              <InfoBox label="Father's Name" value={selectedUser.father} />
              <InfoBox label="Mother's Name" value={selectedUser.mother} />
              <InfoBox label="Paternal Grandfather" value={selectedUser.grandfather} />
              <InfoBox label="Paternal Grandmother" value={selectedUser.grandmother} />
              <InfoBox label="Siblings" value={selectedUser.siblings} />
            </>
          )}

          {activeTab === "horoscope" && (
            <>
              <InfoBox label="Raasi" value={selectedUser.raasi} />
              <InfoBox label="Star" value={selectedUser.star} />
              <InfoBox label="Dosham" value={selectedUser.dosham} />
              <InfoBox label="Birth Place" value={selectedUser.birthPlace} />
              
              <div className="sm:col-span-2 lg:col-span-3 mt-4">
                <div className="p-5 md:p-6 bg-[#FAF6F3] border border-[#EEEEEE] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-[#5D4037] flex-shrink-0">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Jadhagam File</p>
                      <p className="text-sm font-bold text-[#5D4037] truncate max-w-[150px] sm:max-w-xs">{selectedUser.horoscope?.uploaded ? (selectedUser.horoscope.fileName || "horoscope.pdf") : "Not Uploaded"}</p>
                    </div>
                  </div>
                  {selectedUser.horoscope?.uploaded && (
                    <a href={`/${selectedUser.horoscope.fileUrl}`} target="_blank" rel="noreferrer"
                       className="px-6 py-2.5 bg-[#5D4037] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition flex items-center gap-2">
                      <Download size={14} /> View / Download
                    </a>
                  )}
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
    <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-[#EEEEEE] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[#EEEEEE] flex flex-col xl:flex-row justify-between items-center gap-6">
        <div className="text-center xl:text-left">
          <h2 className="text-xl md:text-2xl font-black text-[#5D4037] tracking-tight">User Records</h2>
          <p className="text-[10px] font-bold text-[#A67C52] uppercase tracking-widest mt-1">Manage profiles and visibility</p>
        </div>
        <div className="flex bg-[#FAF6F3] p-1.5 rounded-[22px] border border-[#EEEEEE] overflow-x-auto no-scrollbar max-w-full">
          {["all", "male", "female", "active", "inactive"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} 
              className={`px-5 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase rounded-[18px] transition-all whitespace-nowrap ${filter === f ? "bg-white text-[#5D4037] shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="bg-[#FAF6F3]/50 text-[10px] font-black text-stone-400 uppercase tracking-[2px] border-b border-[#EEEEEE]">
              <th className="px-6 md:px-8 py-5">Profile Details</th>
              <th className="px-6 md:px-8 py-5">Profession</th>
              <th className="px-6 md:px-8 py-5 text-center">Visibility</th>
              <th className="px-6 md:px-8 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEEEE]">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="group hover:bg-[#FAF6F3]/50 transition-all">
                <td className="px-6 md:px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-[16px] md:rounded-[18px] bg-[#5D4037] overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {u.photo ? <img src={u.photo} alt="" className="w-full h-full object-cover"/> : <span className="text-white font-black text-sm">{u.fullName.charAt(0)}</span>}
                    </div>
                    <div>
                      <p className="text-[13px] md:text-[14px] font-black text-[#5D4037] leading-none">{u.fullName}</p>
                      <p className="text-[9px] md:text-[10px] text-[#A67C52] font-bold uppercase tracking-widest mt-1.5">{u.gender} • {u.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5">
                  <p className="text-xs font-bold text-stone-600 truncate max-w-[150px]">{u.occupation}</p>
                  <p className="text-[10px] text-stone-400 uppercase font-black mt-1 tracking-tighter">{u.income}</p>
                </td>
                <td className="px-6 md:px-8 py-5 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                   <button
  onClick={() => togglePublicStatus(u.id, u.is_active)}
  className={`w-9 h-4.5 md:w-10 md:h-5 rounded-full relative transition-all ${
    u.is_active === 1 ? "bg-[#A67C52]" : "bg-stone-200"
  }`}
>
                      <span className={`absolute top-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full shadow-sm transition-all ${u.is_active ? "left-[19px] md:left-[22px]" : "left-0.5"}`} />
                    </button>
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${u.is_active ? 'text-[#A67C52]' : 'text-rose-400'}`}>
                     {u.is_active === 1 ? "ACTIVE" : "INACTIVE"}

                    </span>
                  </div>
                </td>
                <td className="px-6 md:px-8 py-5 text-center">
                  <button onClick={() => setSelectedUser(u)} className="p-2.5 md:p-3 text-[#5D4037] bg-[#FAF6F3] hover:bg-[#5D4037] hover:text-white rounded-xl md:rounded-2xl transition-all shadow-sm">
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
    <label className="text-[8px] md:text-[9px] font-black text-stone-400 uppercase tracking-[1.5px] ml-1 group-hover:text-[#A67C52] transition-colors">{label}</label>
    <div className="px-5 md:px-6 py-4 md:py-5 bg-[#FAF6F3]/50 border border-[#EEEEEE] rounded-[20px] md:rounded-[24px] text-[12px] md:text-[13px] font-bold text-[#5D4037] group-hover:border-[#A67C52] group-hover:bg-white transition-all shadow-sm">
      {value || "—"}
    </div>
  </div>
);

export default AllUsers;

