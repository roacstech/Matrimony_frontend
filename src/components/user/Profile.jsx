import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  MapPin,
  Sparkles,
  Briefcase,
  Users,
  ShieldCheck,
  FileText,
  Upload,
  Check,
  X,
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../api/userApi";

import {
  getEnumOptions,
  getEnumLabel,
} from "../../utils/convertHelper";
import { calculateAge } from "../../utils/dateHelper";

// ─── S3 imports ───────────────────────────────────────────────────────────────
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3awsConfig from "../../utils/aws-config"; // adjust path if needed

// ─── S3 bucket & folder constants ─────────────────────────────────────────────
const S3_BUCKET        = "roacs-bucket";
const S3_BASE_URL      = `https://${S3_BUCKET}.s3.ap-south-1.amazonaws.com`;
const PHOTO_FOLDER     = "matrimony-profiles/photos";
const HOROSCOPE_FOLDER = "matrimony-profiles/horoscopes";

// ─── Helper: upload a single File to S3, returns the public URL ───────────────
const uploadFileToS3 = async (file, folder) => {
  const ext         = file.name?.split(".").pop() || "bin";
  const fileKey     = `${folder}/${uuidv4()}.${ext}`;
  const contentType = file.type || "application/octet-stream";
  const uint8Array  = new Uint8Array(await file.arrayBuffer());

  await s3awsConfig.send(
    new PutObjectCommand({
      Bucket:      S3_BUCKET,
      Key:         fileKey,
      Body:        uint8Array,
      ContentType: contentType,
    })
  );

  return `${S3_BASE_URL}/${fileKey}`;
};

export const PRIVACY_OPTIONS = [
  { value: "Public",  label: "🌍 Public / பொது" },
  { value: "Private", label: "🔒 Private / தனிப்பட்ட" },
];

const Profile = () => {
  const userId = localStorage.getItem("userid");
  const [user,       setUser]       = useState(null);
  const [edit,       setEdit]       = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef  = useRef(null);
  const horoscopeRef  = useRef(null);

  const displayMode = "both"; // "tamil" | "both"

  const formatTime12h = (time) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    let hours    = Number(h);
    const period = hours >= 12 ? "PM" : "AM";
    hours        = hours % 12 || 12;
    return `${hours}:${m} ${period}`;
  };

  // ── Fetch profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    getUserProfile(userId)
      .then((res) => {
        if (res?.success) {
          setUser(res.data);
        } else {
          setUser({});
          toast.error(res?.message || "No profile found");
        }
      })
      .catch(() => toast.error("API Error"))
      .finally(() => setLoading(false));
  }, []);

  // ── Horoscope upload → S3 ──────────────────────────────────────────────────
  const handleHoroscopeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading horoscope…");
    setIsUploading(true);
    try {
      const url = await uploadFileToS3(file, HOROSCOPE_FOLDER);
      toast.dismiss(toastId);
      toast.success("Horoscope updated");

      setUser((prev) => ({
        ...prev,
        horoscope_uploaded:   1,
        horoscope_file_name:  file.name,
        horoscope_file_url:   url,
        horoscope: {
          uploaded: true,
          fileName: file.name,
          fileUrl:  url,
        },
      }));
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Horoscope upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // ── Profile photo upload → S3 ──────────────────────────────────────────────
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading photo…");
    setIsUploading(true);
    try {
      const url = await uploadFileToS3(file, PHOTO_FOLDER);
      toast.dismiss(toastId);
      toast.success("Photo updated");

      // Store full S3 URL so the <img> below renders it directly
      setUser((prev) => ({ ...prev, photo: url }));
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Photo upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // ── Generic field change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ── Save profile (text fields only; files already on S3) ──────────────────
  const handleSave = async () => {
    try {
      const { horoscope, ...cleanUser } = user;
      const res = await updateUserProfile(cleanUser);
      if (res.success) {
        toast.success("Profile Updated!");
        setEdit(false);
        const updated = await getUserProfile(userId);
        if (updated?.success) setUser(updated.data);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // ── Resolve photo src: full URL (S3) or legacy relative path ──────────────
  const resolvePhotoSrc = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `${import.meta.env.VITE_IMG_URL}/photos/${photo}`;
  };

  // ── Resolve horoscope URL ──────────────────────────────────────────────────
  const resolveHoroscopeSrc = (user) => {
    const url = user?.horoscope?.fileUrl || user?.horoscope_file_url;
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_IMG_URL}/photos/${url.split("/").pop()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-medium text-gray-400 animate-pulse">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-3 md:p-6 bg-transparent min-h-screen font-sans">

      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/5">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
          <div className="relative group">
            <div className="w-24 h-24 rounded-xl border-4 border-[#F8FAFC] overflow-hidden bg-gray-50 flex items-center justify-center shadow-md">
              {user?.photo ? (
                <img
                  src={resolvePhotoSrc(user.photo)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-[#111827]">
                  {user?.full_name?.charAt(0)}
                </span>
              )}
            </div>

            <div
              className={`absolute -bottom-1 -right-1 px-3 py-1 rounded-md text-[8px] font-semibold uppercase border-2 border-white shadow-md ${
                user?.privacy === "Public"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#1A5AF0] text-white"
              }`}
            >
              {user?.privacy} Mode
            </div>

            {edit && (
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="cursor-pointer absolute inset-0 bg-[#111827]/40 rounded-xl flex items-center justify-center transition-all hover:bg-[#111827]/60 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="text-white text-[10px] font-medium animate-pulse">
                    Uploading…
                  </span>
                ) : (
                  <Camera className="text-white" size={24} />
                )}
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-xl md:text-2xl font-semibold text-[#111827] uppercase tracking-tight">
              {user?.full_name}
            </h1>
            <p className="text-[10px] font-semibold text-[#1A5AF0] uppercase tracking-[2px] flex items-center gap-2 mt-1">
              <MapPin size={14} /> {user?.city}, {user?.country}
            </p>
            <span className="text-xs font-medium text-gray-400 mt-1">{user?.email}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="cursor-pointer w-full md:w-auto bg-[#111827] text-white px-8 py-3 rounded-lg text-[12px] font-semibold  tracking-[2px] hover:bg-[#1A5AF0] transition-all shadow-lg shadow-blue-100"
            >
              Edit Profile
            </button>
          ) : (
            <>  
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="cursor-pointer w-full md:w-auto bg-emerald-600 text-white px-5 py-3 rounded-lg text-[12px] font-semibold  tracking-[2px] flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={14} /> Save Changes
              </button>
              <button
                onClick={() => setEdit(false)}
                className="cursor-pointer w-full md:w-auto bg-white text-gray-600 px-8 py-3 rounded-lg text-[12px] font-semibold  tracking-[2px] border border-1-red-600 hover:bg-rose-50 hover:text-rose-500 transition-all"
              >
               Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Basic Details ── */}
        <Section title="Basic Details" icon={<Users size={16} />}>
          <Input
            edit={edit}
            label="Full Name / முழு பெயர்"
            name="full_name"
            value={user?.full_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Gender / பாலினம்"
            name="gender"
            value={
              edit
                ? user?.gender
                : getEnumLabel("gender", user?.gender, displayMode)
            }
            onChange={handleChange}
            options={getEnumOptions("gender", displayMode)}
          />
          <Input
            edit={edit}
            label="Date of Birth / பிறந்த தேதி"
            name="dob"
            type="date"
            min="1900-01-01"
            max={new Date().toISOString().split("T")[0]}
            value={
              edit
                ? user?.dob?.split("T")[0]
                : user?.dob
                ? new Date(user?.dob).toLocaleDateString("en-GB")
                : ""
            }
            onChange={handleChange}
          />
          <Input
            edit={false}
            label="Age / வயது"
            name="age"
            value={user?.dob ? `${calculateAge(user.dob)} Years` : ""}
            type="text"
          />
          <Input
            edit={edit}
            label="Birth Place / பிறந்த இடம்"
            name="birth_place"
            value={user?.birth_place || ""}
            onChange={handleChange}
            type="text"
          />
          <Input
            edit={edit}
            label="Birth Time / பிறந்த நேரம்"
            name="birth_time"
            value={
              edit
                ? user?.birth_time?.slice(0, 5)
                : formatTime12h(user?.birth_time)
            }
            onChange={handleChange}
            type="time"
          />
          <Input
            edit={edit}
            label="Phone Number / தொலைபேசி எண்"
            name="phone"
            value={user?.phone}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Marital Status / திருமண நிலை"
            name="marital_status"
            value={
              edit
                ? user?.marital_status
                : getEnumLabel("maritalStatus", user?.marital_status, displayMode)
            }
            onChange={handleChange}
            options={getEnumOptions("maritalStatus", displayMode)}
          />
        </Section>

        {/* ── Education & Career ── */}
        <Section title="Education & Career" icon={<Briefcase size={16} />}>
          <Input
            edit={edit}
            label="Education / கல்வி"
            name="education"
            value={user?.education}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Occupation / தொழில்"
            name="occupation"
            value={user?.occupation}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Income / வருமானம்"
            name="income"
            value={user?.income}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Work Location / பணியிடம்"
            name="work_location"
            value={user?.work_location}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Email / மின்னஞ்சல்"
            name="email"
            value={user?.email}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </Section>

        {/* ── Astrology ── */}
        <Section title="Astrology Info" icon={<Sparkles size={16} />}>
          <Input
            edit={edit}
            label="Raasi / ராசி"
            name="raasi"
            value={
              edit ? user?.raasi : getEnumLabel("raasi", user?.raasi, displayMode)
            }
            onChange={handleChange}
            options={getEnumOptions("raasi", displayMode)}
          />
          <Input
            edit={edit}
            label="Star / நட்சத்திரம்"
            name="star"
            value={
              edit ? user?.star : getEnumLabel("star", user?.star, displayMode)
            }
            onChange={handleChange}
            options={getEnumOptions("star", displayMode)}
          />
          <Input
            edit={edit}
            label="Dosham / தோஷம்"
            name="dosham"
            value={
              edit
                ? user?.dosham
                : getEnumLabel("dosham", user?.dosham, displayMode)
            }
            onChange={handleChange}
            options={getEnumOptions("dosham", displayMode)}
            className="md:col-span-2"
          />

          {/* ── Horoscope upload → S3 ── */}
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-1">
            <span className="text-[9px] font-semibold text-[#1A5AF0] uppercase tracking-wider">
              Jadhagam (PDF/JPG) / ஜாதகம்
            </span>

            {edit ? (
              <div
                onClick={() => !isUploading && horoscopeRef.current.click()}
                className={`cursor-pointer bg-blue-50/50 border-2 border-dashed border-blue-200 p-3 rounded-lg flex items-center justify-center gap-2 text-[10px] font-medium text-[#111827] hover:bg-blue-50 transition-all ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? (
                  <span className="animate-pulse text-[#1A5AF0]">Uploading…</span>
                ) : (
                  <>
                    <Upload size={14} />
                    {user?.horoscope?.uploaded || user?.horoscope_uploaded
                      ? "Update File"
                      : "Upload File"}
                  </>
                )}
                <input
                  type="file"
                  ref={horoscopeRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleHoroscopeUpload}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#111827] py-2 bg-[#F8FAFC] px-3 rounded-lg border border-gray-100 overflow-hidden">
                <FileText size={14} className="text-[#1A5AF0] shrink-0" />
                {user?.horoscope?.uploaded || user?.horoscope_uploaded ? (
                  <a
                    href={resolveHoroscopeSrc(user)}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer underline hover:text-[#1A5AF0] truncate"
                  >
                    {user?.horoscope?.fileName || user?.horoscope_file_name}
                  </a>
                ) : (
                  <span className="text-gray-400">Not Uploaded</span>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* ── Family Details ── */}
        <Section title="Family Details" icon={<Users size={16} />}>
          <Input
            edit={edit}
            label="Father Name"
            name="father_name"
            value={user?.father_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Mother Name"
            name="mother_name"
            value={user?.mother_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Grandfather"
            name="grandfather_name"
            value={user?.grandfather_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Grandmother"
            name="grandmother_name"
            value={user?.grandmother_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Mother Side GF"
            name="mother_side_grandfather_name"
            value={user?.mother_side_grandfather_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Mother Side GM"
            name="mother_side_grandmother_name"
            value={user?.mother_side_grandmother_name}
            onChange={handleChange}
          />
          <Input
            edit={edit}
            label="Siblings"
            name="siblings"
            value={user?.siblings}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </Section>

        {/* ── Location & Settings ── */}
        <Section
          title="Location & Settings"
          icon={<ShieldCheck size={16} />}
          className="md:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full col-span-2">
            <Input
              edit={edit}
              label="City / நகரம்"
              name="city"
              value={user?.city}
              onChange={handleChange}
            />
            <Input
              edit={edit}
              label="Country / நாடு"
              name="country"
              value={user?.country}
              onChange={handleChange}
            />
            <Input
              edit={edit}
              label="Status / தனியுரிமை"
              name="privacy"
              value={user?.privacy}
              onChange={handleChange}
              options={PRIVACY_OPTIONS}
            />
            <Input
              edit={edit}
              label="Home Address / வீட்டு முகவரி"
              name="address"
              value={user?.address}
              onChange={handleChange}
              className="sm:col-span-2 lg:col-span-3"
            />
          </div>
        </Section>

        {/* ── Remarks ── */}
        <Section
          title="Remarks"
          icon={<Sparkles size={16} />}
          className="md:col-span-2"
        >
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[9px] font-semibold text-[#1A5AF0] uppercase tracking-[1.5px] px-1">
              Remarks / குறிப்புகள்
            </label>
            {edit ? (
              <textarea
                name="remarks"
                value={user?.remarks || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Additional details / குறிப்புகள்"
                className="w-full bg-[#F8FAFC] border border-gray-100 px-4 py-3 rounded-lg text-[11px] font-medium text-[#111827] focus:ring-2 focus:ring-[#1A5AF0]/20 outline-none"
              />
            ) : (
              <div className="text-[12px] font-medium text-[#111827] px-1 py-2 break-words">
                {user?.remarks || "---"}
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
const Section = ({ title, icon, children, className }) => (
  <div
    className={`bg-white p-5 md:p-7 rounded-xl border border-gray-100 shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-shadow ${className}`}
  >
    <div className="flex items-center gap-3 mb-6">
      <span className="p-2 bg-blue-50/50 rounded-lg text-[#1A5AF0]">{icon}</span>
      <h3 className="text-[11px] md:text-[12px] font-semibold text-[#111827] uppercase tracking-[2px]">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
      {children}
    </div>
  </div>
);

const Input = ({
  label,
  edit,
  value,
  type = "text",
  options,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-[9px] font-semibold text-[#1A5AF0] uppercase tracking-[1px] px-1">
      {label}
    </label>
    {edit ? (
      options ? (
        <select
          {...props}
          value={value || ""}
          className="cursor-pointer w-full bg-[#F8FAFC] border border-gray-100 px-4 py-2.5 rounded-lg text-[11px] font-medium text-[#111827] outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Select</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...props}
          type={type}
          value={value || ""}
          className="w-full bg-[#F8FAFC] border border-gray-100 px-4 py-2.5 rounded-lg text-[11px] font-medium text-[#111827] outline-none focus:ring-2 focus:ring-blue-100"
        />
      )
    ) : (
      <div className="text-[12px] font-medium text-[#111827] px-1 py-1 truncate">
        {value || "---"}
      </div>
    )}
  </div>
);

export default Profile;