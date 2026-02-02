import React, { useEffect, useState, useRef } from "react";
import { getUserById, updateUser } from "../../Data/UpdateProfile";
import toast from "react-hot-toast";
import { Camera, MapPin, Sparkles, Briefcase, Users, ShieldCheck, FileText, Upload } from "lucide-react";

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

  if (!user) return <div className="p-6 font-black text-center text-[#3B1E54]">Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Jadhagam File Upload Handle
  const handleHoroscopeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser((prev) => ({
        ...prev,
        horoscope: {
          uploaded: true,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file), // Real-time preview
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
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-[#FDFCFE] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="bg-white border rounded-[32px] p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full border-4 border-[#F3F0F7] overflow-hidden bg-gray-100 flex items-center justify-center">
              {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-[#3B1E54]">{user.fullName.charAt(0)}</span>}
            </div>
            <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border-2 border-white shadow-sm ${user.privacy === "Public" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
              {user.privacy}
            </div>
            {edit && (
              <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <Camera className="text-white" size={18} />
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setUser({...user, photo: URL.createObjectURL(e.target.files[0])})} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#3B1E54] uppercase tracking-tight">{user.fullName}</h1>
            <p className="text-[10px] font-bold text-[#9B7EBD] uppercase tracking-widest flex items-center gap-1"><MapPin size={12} /> {user.city}, {user.country}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {!edit ? (
            <button onClick={() => setEdit(true)} className="bg-[#3B1E54] text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Edit Details</button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-emerald-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Save</button>
              <button onClick={() => setEdit(false)} className="bg-gray-100 text-gray-400 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border">Cancel</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Basic Details" icon={<Users size={14}/>}>
          <Input edit={edit} label="Full Name" name="fullName" value={user.fullName} onChange={handleChange} />
          <Input edit={edit} label="Gender" name="gender" value={user.gender} onChange={handleChange} />
          <Input edit={edit} label="Date of Birth" name="dob" value={user.dob} onChange={handleChange} />
          <Input edit={edit} label="Birth Time" name="birthTime" value={user.birthTime} onChange={handleChange} />
          <Input edit={edit} label="Marital Status" name="maritalStatus" value={user.maritalStatus} onChange={handleChange} />
        </Section>

        <Section title="Education & Career" icon={<Briefcase size={14}/>}>
          <Input edit={edit} label="Education" name="education" value={user.education} onChange={handleChange} />
          <Input edit={edit} label="Occupation" name="occupation" value={user.occupation} onChange={handleChange} />
          <Input edit={edit} label="Income" name="income" value={user.income} onChange={handleChange} />
        </Section>

        {/* ================= ASTROLOGY SECTION WITH UPLOAD ================= */}
        <Section title="Astrology Info" icon={<Sparkles size={14}/>}>
          <Input edit={edit} label="Raasi" name="raasi" value={user.raasi} onChange={handleChange} />
          <Input edit={edit} label="Star" name="star" value={user.star} onChange={handleChange} />
          <Input edit={edit} label="Dosham" name="dosham" value={user.dosham} onChange={handleChange} />
          
          <div className="col-span-1 flex flex-col gap-1">
            <span className="text-[8px] font-black text-gray-400 uppercase">Jadhagam (PDF/JPG)</span>
            {edit ? (
              <div 
                onClick={() => horoscopeRef.current.click()}
                className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-200 p-2 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 hover:bg-blue-100 transition-all"
              >
                <Upload size={14} /> Update File
                <input type="file" ref={horoscopeRef} className="hidden" onChange={handleHoroscopeUpload} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#3B1E54] py-1">
                <FileText size={14} className="text-blue-500" />
                {user.horoscope?.uploaded ? (
                  <a href={user.horoscope.fileUrl} target="_blank" className="underline truncate max-w-[100px]">
                    {user.horoscope.fileName}
                  </a>
                ) : "Not Uploaded"}
              </div>
            )}
          </div>
        </Section>

        <Section title="Family Details" icon={<Users size={14}/>}>
          <Input edit={edit} label="Father Name" name="father" value={user.father} onChange={handleChange} />
          <Input edit={edit} label="Mother Name" name="mother" value={user.mother} onChange={handleChange} />
          <Input edit={edit} label="Religion" name="religion" value={user.religion} onChange={handleChange} />
          <Input edit={edit} label="Caste" name="caste" value={user.caste} onChange={handleChange} />
        </Section>

        <Section title="Location & Settings" icon={<ShieldCheck size={14}/>}>
          <Input edit={edit} label="City" name="city" value={user.city} onChange={handleChange} />
          <Input edit={edit} label="Country" name="country" value={user.country} onChange={handleChange} />
          <Input edit={edit} label="Privacy" name="privacy" value={user.privacy} onChange={handleChange} />
        </Section>
      </div>
    </div>
  );
};

/* HELPERS */
const Section = ({ title, icon, children }) => (
  <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 mb-4 text-[#3B1E54]"><span className="p-1.5 bg-[#F3F0F7] rounded-lg">{icon}</span><h3 className="text-[11px] font-black uppercase tracking-widest">{title}</h3></div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  </div>
);

const Input = ({ label, edit, value, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1">{label}</label>
    {edit ? (
      <input {...props} value={value || ""} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#3B1E54] focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" />
    ) : (
      <div className="text-[11px] font-black text-[#3B1E54] px-1 truncate">{value || "---"}</div>
    )}
  </div>
);

export default Profile;