import React, { useEffect } from "react";
import toast from "react-hot-toast";

import {
  CloudArrowUpIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useMatrimonyForm } from "../Data/form";
import { useNavigate } from "react-router-dom";

const steps = [
  "தனிப்பட்ட விவரங்கள் / Personal Details",
  "கல்வி & தொழில் / Education & Career",
  "குடும்ப விவரங்கள் / Family Details",
  "ஜாதக விவரங்கள் / Horoscope Details",
  "முகவரி விவரங்கள் / Address Details",
  "சுயவிவர தனியுரிமை / Profile Visibility",
  "சுருக்கம் / Summary",
];

const MatrimonyForm = () => {
  // console.log("🔥 MATRIMONY FORM RENDERED");
  const navigate = useNavigate();
  const {
    currentStep,
    formData,
    handleChange,
    handleFileChange,
    nextStep,
    prevStep,
    submitForm,
  } = useMatrimonyForm();

  // ✅ ADD THIS HERE (JUST BELOW HOOKS)
  useEffect(() => {
    console.log("🔥 FORM DATA =>", formData);
  }, [formData]);

  // Color Patterns applied to constants
  const input =
    "w-full px-4 py-3 rounded-xl border border-[#EEEEEE] bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#A67C52]";
  const uploadBox =
    "relative w-40 h-40 rounded-2xl bg-[#EEEEEE]/50 flex items-center justify-center overflow-hidden shadow-md cursor-pointer mx-auto mt-4 border-2 border-dashed border-[#A67C52]/30";

  return (
    // Outer Background: Cream #FAF6F3
    <div className="min-h-screen bg-[#FAF6F3] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-3 overflow-hidden min-h-[600px]">
        {/* LEFT STEPPER: Using Brown tones #5D4037 & Soft Grey #EEEEEE */}
        <div className="bg-[#EEEEEE] p-8 text-[#5D4037]">
          <h2 className="text-2xl font-bold mb-10">
            சுயவிவரம் உருவாக்கவும் / Create Profile
          </h2>
          <ul className="space-y-6">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-[#5D4037] text-white" // Active step Brown
                      : "border border-[#5D4037]/40 text-[#5D4037]/50"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={
                    i === currentStep
                      ? "font-bold text-[#5D4037]"
                      : "opacity-70 text-sm"
                  }
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="md:col-span-2 p-8 md:p-12 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="font-semibold text-[#5D4037] hover:text-[#A67C52] transition-colors"
            >
              ← வெளியேறு / Exit
            </button>
            <span className="text-sm text-[#5D4037]/70 font-bold">
              படி {currentStep + 1} / Step {currentStep + 1} of 6
            </span>
          </div>

          <h3 className="text-2xl font-bold text-[#5D4037] mb-8 border-b border-[#EEEEEE] pb-2">
            {steps[currentStep]}
          </h3>

          <div className="flex-1 min-h-[350px]">
            {/* STEP 0 - Personal */}
            {currentStep === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="fullName"
                  placeholder="Full Name / முழு பெயர்"
                  onChange={handleChange}
                  value={formData.fullName}
                />
                <select
                  className={input}
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value="">Gender / பாலினம்</option>
                  <option value="Male">Male / ஆண்</option>
                  <option value="Female">Female / பெண்</option>
                </select>

                <div className="relative">
                  {!formData.dob && (
                    <span className="absolute left-3 top-1 text-[#5D4037]  pointer-events-none">
                      Date of Birth / பிறந்த தேதி
                    </span>
                  )}

                  <input
                    type="date"
                    className={`${input} pt-6`}
                    name="dob"
                    onChange={handleChange}
                    value={formData.dob}
                    min="1950-01-01"
                    max={new Date().toISOString().split("T")[0]}
                  />
 
                </div>

<div className="flex items-center gap-3">
  <div className="relative w-full">
    {!formData.birthTime && (
      <span className="absolute left-3 top-1 text-[#5D4037] pointer-events-none">
        Birth Time / பிறந்த நேரம்
      </span>
    )}

    <input
      type="time"                // ✅ AUTO + MANUAL (keyboard)
      name="birthTime"
      value={formData.birthTime}
      onChange={handleChange}
      className="w-full rounded-md border border-gray-300 px-3 pt-6 pb-2
                 focus:outline-none focus:ring-2 focus:ring-brown-500"
    />
  </div>

  <select
    name="birthPeriod"
    value={formData.birthPeriod}
    onChange={handleChange}
    className="w-20 rounded-md border border-gray-300 px-2 py-2"
  >
    <option value="">--</option>
    <option value="AM">AM</option>
    <option value="PM">PM</option>
  </select>
</div>

                <input
                  className={input}
                  name="email"
                  placeholder="Email / மின்னஞ்சல்"
                  onChange={handleChange}
                  value={formData.email}
                />

                 <input
  className={input}
  name="phone"
  placeholder="Phone Number / தொலைபேசி எண்"
  onChange={handleChange}
  value={formData.phone}
  type="tel"                 // ✅ phone input
  maxLength={10}             // ✅ Indian number
/>
                <select
                  className={input}
                  name="maritalStatus"
                  onChange={handleChange}
                  value={formData.maritalStatus}
                >
                  <option value="">Marital Status / திருமண நிலை</option>
                  <option value="Unmarried">Unmarried / திருமணமாகாதவர்</option>
                  <option value="Divorced">Divorced / விவாகரத்து </option>
                  <option value="Widowed">Widowed / விதவை </option>
                </select>
              </div>
            )}

            {/* STEP 1 - Career */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="education"
                  placeholder="Education / கல்வி"
                  onChange={handleChange}
                  value={formData.education}
                />
                <input
                  className={input}
                  name="occupation"
                  placeholder="Occupation / தொழில்"
                  onChange={handleChange}
                  value={formData.occupation}
                />
                <input
                  className={input}
                  name="income"
                  placeholder="Monthly Income /மாத வருமானம்"
                  onChange={handleChange}
                  value={formData.income}
                />

                {/* ✅ NEW FIELD */}
                <input
                  className={input}
                  name="workLocation"
                  placeholder="Work Location / வேலை இடம்"
                  onChange={handleChange}
                  value={formData.workLocation}
                />
              </div>
            )}

            {/* STEP 2 - Family */}
            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="father"
                  placeholder="Father Name / தந்தை பெயர்"
                  onChange={handleChange}
                  value={formData.father}
                />
                <input
                  className={input}
                  name="mother"
                  placeholder="Mother Name / தாய் பெயர்"
                  onChange={handleChange}
                  value={formData.mother}
                />
                <input
                  className={input}
                  name="grandfather"
                  placeholder="Grandfather Name / தாத்தா பெயர்"
                  onChange={handleChange}
                  value={formData.grandfather}
                />
                <input
                  className={input}
                  name="grandmother"
                  placeholder="Grandmother Name / பாட்டி பெயர்"
                  onChange={handleChange}
                  value={formData.grandmother}
                />
                <input
                  className={input}
                  name="motherSideGrandfather"
                  placeholder="Mother Side Grandfather Name / தாய்வழி தாத்தா பெயர்"
                  onChange={handleChange}
                  value={formData.motherSideGrandfather}
                />

                <input
                  className={input}
                  name="motherSideGrandmother"
                  placeholder="Mother Side Grandmother Name / தாய்வழி பாட்டி பெயர்"
                  onChange={handleChange}
                  value={formData.motherSideGrandmother}
                />
                <input
                  className={input}
                  name="siblings"
                  placeholder="Siblings / உடன்பிறப்புகள்
"
                  type="number"
                  onChange={handleChange}
                  value={formData.siblings}
                />
              </div>
            )}

            {/* STEP 3 - Horoscope */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <select
                    className={input}
                    name="raasi"
                    onChange={handleChange}
                    value={formData.raasi}
                  >
                    <option value="">Raasi / இராசி</option>
                    <option value="Aries">மேஷம் (Aries)</option>
                    <option value="Taurus">ரிஷபம் (Taurus)</option>
                    <option value="Gemini">மிதுனம் (Gemini)</option>
                    <option value="Cancer">கடகம் (Cancer)</option>
                    <option value="Leo">சிம்மம் (Leo)</option>
                    <option value="Virgo">கன்னி (Virgo)</option>
                    <option value="Libra">துலாம் (Libra)</option>
                    <option value="Scorpio">விருச்சிகம் (Scorpio)</option>
                    <option value="Sagittarius">தனுசு (Sagittarius)</option>
                    <option value="Capricorn">மகரம் (Capricorn)</option>
                    <option value="Aquarius">கும்பம் (Aquarius)</option>
                    <option value="Pisces">மீனம் (Pisces)</option>
                  </select>

                  <select
                    className={input}
                    name="star"
                    onChange={handleChange}
                    value={formData.star}
                  >
                    <option value="">Natchathiram / நட்சத்திரம்</option>

                    <option value="Aswini">அஸ்வினி (Aswini)</option>
                    <option value="Bharani">பரணி (Bharani)</option>
                    <option value="Krittigai">கிருத்திகை (Krittigai)</option>
                    <option value="Rohini">ரோகிணி (Rohini)</option>
                    <option value="Mirugasheeridam">
                      மிருகசீரிடம் (Mirugasheeridam)
                    </option>
                    <option value="Thiruvathirai">
                      திருவாதிரை (Thiruvathirai)
                    </option>
                    <option value="Punarpoosam">
                      புனர்பூசம் (Punarpoosam)
                    </option>
                    <option value="Poosam">பூசம் (Poosam)</option>
                    <option value="Aayilyam">ஆயில்யம் (Aayilyam)</option>
                    <option value="Magam">மகம் (Magam)</option>
                    <option value="Pooram">பூரம் (Pooram)</option>
                    <option value="Uthiram">உத்திரம் (Uthiram)</option>
                    <option value="Hastham">அஸ்தம் (Hastham)</option>
                    <option value="Chithirai">சித்திரை (Chithirai)</option>
                    <option value="Swathi">சுவாதி (Swathi)</option>
                    <option value="Visakam">விசாகம் (Visakam)</option>
                    <option value="Anusham">அனுஷம் (Anusham)</option>
                    <option value="Kettai">கேட்டை (Kettai)</option>
                    <option value="Moolam">மூலம் (Moolam)</option>
                    <option value="Pooradam">பூராடம் (Pooradam)</option>
                    <option value="Uthiradam">உத்திராடம் (Uthiradam)</option>
                    <option value="Thiruvonam">திருவோணம் (Thiruvonam)</option>
                    <option value="Avittam">அவிட்டம் (Avittam)</option>
                    <option value="Sathayam">சதயம் (Sathayam)</option>
                    <option value="Poorattathi">பூரட்டாதி (Poorattathi)</option>
                    <option value="Uthirattathi">
                      உத்திரட்டாதி (Uthirattathi)
                    </option>
                    <option value="Revathi">ரேவதி (Revathi)</option>
                  </select>

                  <select
                    className={input}
                    name="dosham"
                    onChange={handleChange}
                    value={formData.dosham}
                  >
                    <option value="">Dosham / தோஷாம்</option>
                    <option value="Sevvai">Sevvai / செவ்வாய்</option>
                    <option value="Kethu">Kethu / கேது </option>
                    <option value="Raagu"> Raagu / ராகு</option>
                    <option value="No">No / இல்லை</option>
                  </select>
                  {/* 
                  <input
                    className={input}
                    name="religion"
                    placeholder="Religion"
                    onChange={handleChange}
                    value={formData.religion}
                  /> */}
                  {/* <input
                    className={input}
                    name="caste"
                    placeholder="Caste"
                    onChange={handleChange}
                    value={formData.caste}
                  /> */}
                  
                </div>
                <div className={uploadBox}>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    {formData.horoscope ? (
                      <>
                        <DocumentCheckIcon className="w-10 h-10 text-green-600" />
                        <p className="text-xs mt-2 text-center text-[#5D4037]">
                          {formData.horoscope.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-10 h-10 text-[#A67C52]" />
                        <p className="text-xs text-center mt-2 text-[#5D4037]">
                          Upload Horoscope / ஜாதகம்
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      name="horoscope"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4 - Address */}
            {currentStep === 4 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="address"
                  placeholder=" Home Address / வீட்டு முகவரி"
                  onChange={handleChange}
                  value={formData.address}
                />
                <input
                  className={input}
                  name="city"
                  placeholder="City / நகரம்"
                  onChange={handleChange}
                  value={formData.city}
                />
                <input
                  className={input}
                  name="country"
                  placeholder="Country / நாடு"
                  onChange={handleChange}
                  value={formData.country}
                />
              </div>
            )}

            {/* STEP 5 - Visibility */}
            {currentStep === 5 && (
              <div className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-6 border border-[#EEEEEE]">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#5D4037]">
                    Account Settings / கணக்கு அமைப்புகள்
                  </label>
                  <select
                    name="privacy"
                    onChange={handleChange}
                    className={input}
                  >
                    <option value="">Select / தேர்வு செய்யவும்</option>
                    <option value="Public">🌍 Public / பொது</option>
                    <option value="Private">🔒 Private / தனிப்பட்ட</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#5D4037]">
                    Upload Photo / பதிவேற்ற புகைப்படம்
                  </p>

                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all 
      ${
        formData.photo
          ? "bg-green-50 border-green-500 hover:bg-green-100"
          : "bg-[#FAF6F3] hover:bg-[#EEEEEE] border-[#A67C52]/30"
      }`}
                  >
                    {formData.photo ? (
                      <>
                        {/* Success State: Green Icon and Filename */}
                        <DocumentCheckIcon className="w-10 h-10 text-green-600" />
                        <p className="text-xs mt-2 text-center text-green-700 font-medium px-2 truncate w-full">
                          {formData.photo.name}
                        </p>
                      </>
                    ) : (
                      <>
                        {/* Default State: Upload Icon */}
                        <CloudArrowUpIcon className="w-8 h-8 mb-2 text-[#A67C52]" />
                        <p className="text-sm text-[#5D4037] text-center">
                          Click to upload photo / புகைப்படத்தை பதிவேற்ற கிளிக்
                          செய்க
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      name="photo"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <textarea
                  className={input}
                  name="remarks"
                  placeholder="Remarks / குறிப்புகள்"
                  onChange={handleChange}
                  value={formData.remarks}
                />
              </div>
            )}

            {/* STEP 6 - Summary */}
{/* STEP 6 - Summary */}
{/* STEP 6 - Summary */}
{currentStep === 6 && (
  <div className="bg-[#EEEEEE]/50 p-4 md:p-6 rounded-2xl border border-[#A67C52]/20 text-[#5D4037] shadow-sm max-h-[65vh] overflow-y-auto custom-scrollbar">
    <h3 className="text-xl font-bold mb-6 border-b border-[#A67C52]/30 pb-3 flex items-center gap-2">
      <DocumentCheckIcon className="w-6 h-6 text-[#A67C52]" />
      Review Profile Summary / சுருக்கம்
    </h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
      
      {/* 1. TEXT DATA SECTION */}
      {[
       
  { label: "முழு பெயர் / Full Name", value: formData.fullName },
  { label: "பாலினம் / Gender", value: formData.gender },
  { label: "பிறந்த தேதி / Date of Birth", value: formData.dob },
  {
    label: "பிறந்த நேரம் / Birth Time",
    value: `${formData.birthTime} ${formData.birthPeriod || ""}`.trim(),
  },
  { label: "தொலைபேசி எண் / Phone Number", value: formData.phone },
  { label: "திருமண நிலை / Marital Status", value: formData.maritalStatus },
  { label: "கல்வி / Education", value: formData.education },
  { label: "தொழில் / Occupation", value: formData.occupation },
  { label: "வேலை இடம் / Work Location", value: formData.workLocation },
  { label: "தந்தை பெயர் / Father Name", value: formData.father },
  { label: "தாய் பெயர் / Mother Name", value: formData.mother },
  { label: "உடன்பிறப்புகள் / Siblings", value: formData.siblings },
  { label: "இராசி / Raasi", value: formData.raasi },
  { label: "நட்சத்திரம் / Star", value: formData.star },
  { label: "தோஷம் / Dosham", value: formData.dosham },
  { label: "நகரம் / City", value: formData.city },
  { label: "நாடு / Country", value: formData.country },
  { label: "கணக்கு தனியுரிமை / Account Privacy", value: formData.privacy },

      ].map((item, index) => (
        <div key={index} className="flex flex-col border-b border-[#A67C52]/10 pb-1">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">{item.label}</span>
          <span className="text-sm md:text-base font-medium leading-tight truncate">{item.value || "—"}</span>
        </div>
      ))}

      {/* 2. FULL WIDTH ADDRESS */}
      <div className="sm:col-span-2 lg:col-span-3 border-b border-[#A67C52]/10 pb-1">
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Home Address</span>
        <p className="text-sm md:text-base font-medium leading-tight">{formData.address || "—"}</p>
      </div>

      {/* 3. VISUAL MEDIA SECTION */}
      <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        
        {/* Profile Photo Card */}
        <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-[#A67C52]/20 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Profile Photo / புகைப்படம்</span>
          {formData.photo ? (
            <div className="flex items-center gap-3">
              <img 
                src={URL.createObjectURL(formData.photo)} 
                alt="Profile" 
                className="w-24 h-24 object-cover rounded-lg border-2 border-[#A67C52]/20"
                onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Optional: Clean up memory
              />
              <span className="text-xs break-all opacity-70">{formData.photo.name}</span>
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-sm italic opacity-50">No photo</div>
          )}
        </div>

        {/* Horoscope Card - FIXED VISIBILITY */}
        <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-[#A67C52]/20 shadow-sm">
          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Horoscope / ஜாதகம்</span>
          {formData.horoscope ? (
            <div className="flex items-center gap-3">
              {/* Check if it's an image to display it, otherwise show icon */}
              {formData.horoscope.type?.includes("image") ? (
                <img 
                  src={URL.createObjectURL(formData.horoscope)} 
                  alt="Horoscope" 
                  className="w-24 h-24 object-cover rounded-lg border-2 border-[#A67C52]/20"
                />
              ) : (
                <div className="w-24 h-24 bg-[#FAF6F3] flex flex-col items-center justify-center rounded-lg border-2 border-[#A67C52]/20 text-[#A67C52]">
                  <DocumentCheckIcon className="w-8 h-8" />
                  <span className="text-[8px] font-bold mt-1">DOC/PDF</span>
                </div>
              )}
              <span className="text-xs break-all opacity-70">{formData.horoscope.name}</span>
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-sm italic opacity-50">No horoscope</div>
          )}
        </div>

      </div>

      {/* 4. REMARKS */}
      <div className="sm:col-span-2 lg:col-span-3 pt-2">
        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Remarks</span>
        <p className="text-sm font-medium italic text-[#5D4037]/80">{formData.remarks || "No remarks"}</p>
      </div>

    </div>
  </div>
)}
          </div>

          {/* BUTTONS: Using Login Button Brown #573D2F */}
          <div className="flex justify-between mt-8 border-t border-[#EEEEEE] pt-6">
            <button
              onClick={prevStep}
              className={`${
                currentStep === 0 ? "invisible" : "flex items-center gap-2"
              } px-5 py-2.5 bg-[#EEEEEE] text-[#5D4037] rounded-xl font-bold hover:bg-[#A67C52] hover:text-white transition-all`}
            >
              Back
            </button>
            <button
              onClick={() => {
                // 👉 Not last step → Next
                if (currentStep !== 6) {
                  nextStep();
                  return;
                }

                // 👉 Last step (6th) → Submit confirmation toast
                toast(
                  (t) => (
                    <div
                      className={`
           transform-gpu origin-center
            ${t.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            text-center space-y-3
          `}
                    >
                      <p className="font-bold text-[#5D4037] flex justify-center gap-4 mt-3">
                        Are you sure to submit?
                      </p>

                      <div className="flex justify-center gap-4 mt-3">
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            submitForm();
                            setTimeout(() => navigate("/"), 800);
                          }}
                          className="px-4 py-2 bg-[#573D2F] text-white rounded-lg font-bold"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="px-4 py-2 bg-[#EEEEEE] rounded-lg font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    position: "top-center",
                    style: {
                      marginTop: "30vh",
                      marginLeft: "55vw", // 👈 center feel
                      zIndex: 9999, // 👈 front-la varum
                    },
                  },
                );
              }}
              className="px-8 py-3 bg-[#573D2F] text-white rounded-xl font-bold hover:bg-[#5D4037] transition-all"
            >
              {currentStep === 6 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrimonyForm;
