import React, { useEffect, useState, useRef } from "react";
import { getUserById, updateUser } from "../../Data/UpdateProfile";
import toast from "react-hot-toast";
import { Camera, MapPin, Sparkles, Briefcase, Users, ShieldCheck, FileText, Upload, Check, X } from "lucide-react";

const Profile = () => {
  const userId = 1;
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const fileInputRef = useRef(null);
  const horoscopeRef = useRef(null);

  useEffect(() => {
    const data = getUserById(userId);
    setUser({ ...data });
  }, []);

  if (!user) return <div className="p-6 font-black text-center text-[#5D4037]">Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleHoroscopeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        horoscope: {
          uploaded: true,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
        },
      }));
      toast.success("Jadhagam File Selected!");
    }
  };

  const handleSave = () => {
    updateUser(userId, user);
    setEdit(false);
    toast.success("Profile Updated!");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-transparent min-h-screen font-serif">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border border-[#EEEEEE] rounded-[40px] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[30px] border-4 border-[#FAF6F3] overflow-hidden bg-gray-50 flex items-center justify-center shadow-md">
              {user.photo ? (
                <img src={user.photo} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-[#5D4037]">{user.fullName.charAt(0)}</span>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 px-3 py-1 rounded-lg text-[8px] font-black uppercase border-2 border-white shadow-md ${user.privacy === "Public" ? "bg-emerald-500 text-white" : "bg-[#A67C52] text-white"}`}>
              {user.privacy} Mode
            </div>
            {edit && (
              <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-[#5D4037]/40 rounded-[30px] flex items-center justify-center transition-all hover:bg-[#5D4037]/60">
                <Camera className="text-white" size={24} />
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setUser({...user, photo: URL.createObjectURL(e.target.files[0])})} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#5D4037] uppercase tracking-tight">{user.fullName}</h1>
            <p className="text-[10px] font-black text-[#A67C52] uppercase tracking-[3px] flex items-center gap-2 mt-1">
              <MapPin size={14} /> {user.city}, {user.country}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {!edit ? (
            <button onClick={() => setEdit(true)} className="bg-[#5D4037] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#4a332c] transition-all shadow-lg shadow-stone-200">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-emerald-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[2px] flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                <Check size={5}/> Save Changes
              </button>
              <button onClick={() => setEdit(false)} className="bg-white text-gray-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] border border-[#EEEEEE] hover:bg-red-50 transition-all">
                <X size={5}/> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Basic Details" icon={<Users size={16}/>}>
          <Input edit={edit} label="Full Name" name="fullName" value={user.fullName} onChange={handleChange} />
          <Input edit={edit} label="Gender" name="gender" value={user.gender} onChange={handleChange} />
          <Input edit={edit} label="Date of Birth" name="dob" value={user.dob} onChange={handleChange} />
          <Input edit={edit} label="Birth Time" name="birthTime" value={user.birthTime} onChange={handleChange} />
          <Input edit={edit} label="Marital Status" name="maritalStatus" value={user.maritalStatus} onChange={handleChange} />
        </Section>

        <Section title="Education & Career" icon={<Briefcase size={16}/>}>
          <Input edit={edit} label="Education" name="education" value={user.education} onChange={handleChange} />
          <Input edit={edit} label="Occupation" name="occupation" value={user.occupation} onChange={handleChange} />
          <Input edit={edit} label="Income" name="income" value={user.income} onChange={handleChange} />
        </Section>

        {/* ================= ASTROLOGY SECTION ================= */}
        <Section title="Astrology Info" icon={<Sparkles size={16}/>}>
          <Input edit={edit} label="Raasi" name="raasi" value={user.raasi} onChange={handleChange} />
          <Input edit={edit} label="Star" name="star" value={user.star} onChange={handleChange} />
          <Input edit={edit} label="Dosham" name="dosham" value={user.dosham} onChange={handleChange} />
          
          <div className="col-span-1 flex flex-col gap-1">
            <span className="text-[9px] font-black text-[#A67C52] uppercase tracking-wider">Jadhagam (PDF/JPG)</span>
            {edit ? (
              <div 
                onClick={() => horoscopeRef.current.click()}
                className="cursor-pointer bg-[#FAF6F3] border-2 border-dashed border-[#D4C4B7] p-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black text-[#5D4037] hover:bg-[#F5F0EB] transition-all"
              >
                <Upload size={14} /> Update File
                <input type="file" ref={horoscopeRef} className="hidden" onChange={handleHoroscopeUpload} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] font-black text-[#5D4037] py-2 bg-[#FAF6F3] px-3 rounded-xl border border-[#EEEEEE]">
                <FileText size={14} className="text-[#A67C52]" />
                {user.horoscope?.uploaded ? (
                  <a href={user.horoscope.fileUrl} target="_blank" rel="noreferrer" className="underline truncate decoration-[#A67C52] decoration-2">
                    {user.horoscope.fileName}
                  </a>
                ) : <span className="text-gray-400">Not Uploaded</span>}
              </div>
            )}
          </div>
        </Section>

        <Section title="Family Details" icon={<Users size={16}/>}>
          <Input edit={edit} label="Father Name" name="father" value={user.father} onChange={handleChange} />
          <Input edit={edit} label="Mother Name" name="mother" value={user.mother} onChange={handleChange} />
          <Input edit={edit} label="Religion" name="religion" value={user.religion} onChange={handleChange} />
          <Input edit={edit} label="Caste" name="caste" value={user.caste} onChange={handleChange} />
        </Section>

        <Section title="Location & Settings" icon={<ShieldCheck size={16}/>} className="md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
            <Input edit={edit} label="City" name="city" value={user.city} onChange={handleChange} />
            <Input edit={edit} label="Country" name="country" value={user.country} onChange={handleChange} />
            <Input edit={edit} label="Privacy Status" name="privacy" value={user.privacy} onChange={handleChange} />
          </div>
        </Section>
      </div>
    </div>
  );
};

/* HELPERS */
const Section = ({ title, icon, children, className }) => (
  <div className={`bg-white p-7 rounded-[35px] border border-[#EEEEEE] shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <span className="p-2 bg-[#FAF6F3] rounded-xl text-[#A67C52]">{icon}</span>
      <h3 className="text-[12px] font-black text-[#5D4037] uppercase tracking-[2px]">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-x-8 gap-y-5">{children}</div>
  </div>
);

const Input = ({ label, edit, value, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] font-black text-[#A67C52] uppercase tracking-[1.5px] px-1">{label}</label>
    {edit ? (
      <input 
        {...props} 
        value={value || ""} 
        className="bg-[#FAF6F3] border border-[#EEEEEE] px-4 py-2.5 rounded-xl text-[11px] font-bold text-[#5D4037] focus:ring-2 focus:ring-[#A67C52]/20 focus:border-[#A67C52] outline-none transition-all" 
      />
    ) : (
      <div className="text-[12px] font-black text-[#5D4037] px-1 py-1 truncate uppercase tracking-tight">
        {value || "---"}
      </div>
    )}
  </div>
);

export default Profile;