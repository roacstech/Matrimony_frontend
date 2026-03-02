import React, { useEffect } from "react";
import toast from "react-hot-toast";

import {
  CloudArrowUpIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { ShieldCheck } from "lucide-react"; // Required for the Privacy Notice Icon
import { useMatrimonyForm } from "../Data/form";
import { useNavigate } from "react-router-dom";

import { getEnumOptions, getEnumLabel } from "../utils/convertHelper";

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

  const displayMode = "both"; 
// or "tamil"
  // ✅ ADD THIS HERE (JUST BELOW HOOKS)
  useEffect(() => {
    console.log("🔥 FORM DATA =>", formData);
  }, [formData]);

  // Color Patterns updated: Primary #1A5AF0, Text Black
  const input =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#1A5AF0]";
  const uploadBox =
    "relative w-40 h-40 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden shadow-md cursor-pointer mx-auto mt-4 border-2 border-dashed border-[#1A5AF0]/30";

  return (
    // Outer Background: #B3CCFB
    <div className="min-h-screen bg-[#B3CCFB] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-3 overflow-hidden min-h-[600px]">
        {/* LEFT STEPPER */}
        <div className="bg-gray-100 p-8 text-black">
          <h2 className="text-2xl font-bold mb-10">
            சுயவிவரம் உருவாக்கவும் / Create Profile
          </h2>
          <ul className="space-y-6">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-[#1A5AF0] text-white" // Active step Blue
                      : "border border-black/30 text-black/40"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={
                    i === currentStep
                      ? "font-bold text-black"
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
              className="font-semibold text-black hover:text-[#1A5AF0] transition-colors"
            >
              ← வெளியேறு / Exit
            </button>
            <span className="text-sm text-black/70 font-bold">
              படி {currentStep + 1} / Step {currentStep + 1} of 7
            </span>
          </div>

          <h3 className="text-2xl font-bold text-black mb-8 border-b border-gray-100 pb-2">
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
                  {getEnumOptions("gender", displayMode).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  {!formData.dob && (
                    <span className="absolute left-3 top-1 text-black/60 pointer-events-none">
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
                      <span className="absolute left-3 top-1 text-black/60 pointer-events-none">
                        Birth Time / பிறந்த நேரம்
                      </span>
                    )}

                    <input
                      type="time" 
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 pt-6 pb-2 text-black
                                 focus:outline-none focus:ring-2 focus:ring-[#1A5AF0]"
                    />
                  </div>

                  <select
                    name="birthPeriod"
                    value={formData.birthPeriod}
                    onChange={handleChange}
                    className="w-20 rounded-md border border-gray-300 px-2 py-2 text-black"
                  >
                    <option value="">--</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <input
                  className={input}
                  name="birthPlace"
                  placeholder="Birth Place / பிறந்த இடம்"
                  onChange={handleChange}
                  value={formData.birthPlace}
                />
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
                  type="tel" 
                  maxLength={10} 
                />
                <select
                  className={input}
                  name="maritalStatus"
                  onChange={handleChange}
                  value={formData.maritalStatus}
                >
                  <option value="">Marital Status / திருமண நிலை</option>
                  {getEnumOptions("maritalStatus", displayMode).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
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
                  placeholder="Siblings / உடன்பிறப்புகள்"
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
                    {getEnumOptions("raasi", displayMode).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className={input}
                    name="star"
                    onChange={handleChange}
                    value={formData.star}
                  >
                    <option value="">Natchathiram / நட்சத்திரம்</option>
                    {getEnumOptions("star", displayMode).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className={input}
                    name="dosham"
                    onChange={handleChange}
                    value={formData.dosham}
                  >
                    <option value="">Dosham / தோஷாம்</option>
                    {getEnumOptions("dosham", displayMode).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={uploadBox}>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    {formData.horoscope ? (
                      <>
                        <DocumentCheckIcon className="w-10 h-10 text-green-600" />
                        <p className="text-xs mt-2 text-center text-black">
                          {formData.horoscope.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-10 h-10 text-[#1A5AF0]" />
                        <p className="text-xs text-center mt-2 text-black">
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
              <div className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-6 border border-gray-100">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black">
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
                  <p className="text-sm font-semibold text-black">
                    Upload Photo / பதிவேற்ற புகைப்படம்
                  </p>

                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all 
      ${
        formData.photo
          ? "bg-green-50 border-green-500"
          : "bg-gray-50 border-[#1A5AF0]/30"
      }`}
                  >
                    {formData.photo ? (
                      <>
                        <DocumentCheckIcon className="w-10 h-10 text-green-600" />
                        <p className="text-xs mt-2 text-center text-green-700 font-medium px-2 truncate w-full">
                          {formData.photo.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-8 h-8 mb-2 text-[#1A5AF0]" />
                        <p className="text-sm text-black text-center">
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
            {currentStep === 6 && (
              <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200 text-black shadow-sm max-h-[65vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
                  <DocumentCheckIcon className="w-6 h-6 text-[#1A5AF0]" />
                  Review Profile Summary / சுருக்கம்
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                  {/* 1. TEXT DATA SECTION */}
                  {[
                    {
                      label: "முழு பெயர் / Full Name",
                      value: formData.fullName,
                    },
                    {
                      label: "பாலினம் / Gender",
                      value: getEnumLabel(
                        "gender",
                        formData.gender,
                        displayMode,
                      ),
                    },
                    {
                      label: "பிறந்த தேதி / Date of Birth",
                      value: formData.dob,
                    },
                    {
                      label: "பிறந்த நேரம் / Birth Time",
                      value: `${formData.birthTime} ${
                        formData.birthPeriod || ""
                      }`.trim(),
                    },
                    {
                      label: "பிறந்த இடம் / Birth Place",
                      value: formData.birthPlace,
                    },
                    {
                      label: "தொலைபேசி எண் / Phone Number",
                      value: formData.phone,
                    },
                    {
                      label: "திருமண நிலை / Marital Status",
                      value: getEnumLabel(
                        "maritalStatus",
                        formData.maritalStatus,
                        displayMode,
                      ),
                    },
                    { label: "கல்வி / Education", value: formData.education },
                    {
                      label: "தொழில் / Occupation",
                      value: formData.occupation,
                    },
                    {
                      label: "வேலை இடம் / Work Location",
                      value: formData.workLocation,
                    },
                    {
                      label: "தந்தை பெயர் / Father Name",
                      value: formData.father,
                    },
                    {
                      label: "தாய் பெயர் / Mother Name",
                      value: formData.mother,
                    },
                    {
                      label: "உடன்பிறப்புகள் / Siblings",
                      value: formData.siblings,
                    },
                    {
                      label: "இராசி / Raasi",
                      value: getEnumLabel("raasi", formData.raasi, displayMode),
                    },
                    {
                      label: "நட்சத்திரம் / Star",
                      value: getEnumLabel("star", formData.star, displayMode),
                    },
                    {
                      label: "தோஷம் / Dosham",
                      value: getEnumLabel(
                        "dosham",
                        formData.dosham,
                        displayMode,
                      ),
                    },
                    { label: "நகரம் / City", value: formData.city },
                    { label: "நாடு / Country", value: formData.country },
                    {
                      label: "கணக்கு தனியுரிமை / Account Privacy",
                      value: formData.privacy,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col border-b border-gray-200 pb-1"
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A5AF0]">
                        {item.label}
                      </span>
                      <span className="text-sm md:text-base font-medium leading-tight truncate">
                        {item.value || "—"}
                      </span>
                    </div>
                  ))}

                  {/* 2. FULL WIDTH ADDRESS */}
                  <div className="sm:col-span-2 lg:col-span-3 border-b border-gray-200 pb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A5AF0]">
                      Home Address
                    </span>
                    <p className="text-sm md:text-base font-medium leading-tight">
                      {formData.address || "—"}
                    </p>
                  </div>

                  {/* 3. VISUAL MEDIA SECTION */}
                  <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Profile Photo Card */}
                    <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A5AF0]">
                        Profile Photo / புகைப்படம்
                      </span>
                      {formData.photo ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={URL.createObjectURL(formData.photo)}
                            alt="Profile"
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100"
                            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                          />
                          <span className="text-xs break-all opacity-70">
                            {formData.photo.name}
                          </span>
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-sm italic opacity-50">
                          No photo
                        </div>
                      )}
                    </div>

                    {/* Horoscope Card */}
                    <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A5AF0]">
                        Horoscope / ஜாதகம்
                      </span>
                      {formData.horoscope ? (
                        <div className="flex items-center gap-3">
                          {formData.horoscope.type?.includes("image") ? (
                            <img
                              src={URL.createObjectURL(formData.horoscope)}
                              alt="Horoscope"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-50 flex flex-col items-center justify-center rounded-lg border-2 border-gray-100 text-[#1A5AF0]">
                              <DocumentCheckIcon className="w-8 h-8" />
                              <span className="text-[8px] font-bold mt-1">
                                DOC/PDF
                              </span>
                            </div>
                          )}
                          <span className="text-xs break-all opacity-70">
                            {formData.horoscope.name}
                          </span>
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-sm italic opacity-50">
                          No horoscope
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ PRIVACY NOTICE SECTION */}
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
                    <p className="w-full flex items-start gap-4 bg-blue-50 border border-blue-100 p-4 md:p-5 rounded-2xl shadow-sm">
                      <span className="flex-shrink-0 bg-white p-2.5 rounded-xl">
                        <ShieldCheck size={16} className="text-[#1A5AF0]" />
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[12px] md:text-[13px] font-black text-black leading-relaxed">
                          நீங்கள் பதிவிடும் விபரங்கள், நீங்கள் அனுமதித்த
                          பின்னரே, மற்ற வரன்கள் பார்க்க முடியும்
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A5AF0]">
                          Your details will be visible to others only after your
                          approval.
                        </span>
                      </span>
                    </p>
                  </div>

                  {/* 4. REMARKS */}
                  <div className="sm:col-span-2 lg:col-span-3 pt-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A5AF0]">
                      Remarks
                    </span>
                    <p className="text-sm font-medium italic text-black/80">
                      {formData.remarks || "No remarks"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BUTTONS: Using Primary Blue #1A5AF0 */}
          <div className="flex justify-between mt-8 border-t border-gray-100 pt-6">
            <button
              onClick={prevStep}
              className={`${
                currentStep === 0 ? "invisible" : "flex items-center gap-2"
              } px-5 py-2.5 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition-all`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (currentStep !== 6) {
                  nextStep();
                  return;
                }

                toast(
                  (t) => (
                    <div
                      className={`
            transform-gpu origin-center
             ${t.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"}
             text-center space-y-3
           `}
                    >
                      <p className="font-bold text-black flex justify-center gap-4 mt-3">
                        Are you sure to submit?
                      </p>

                      <div className="flex justify-center gap-4 mt-3">
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            submitForm();
                            setTimeout(() => navigate("/"), 800);
                          }}
                          className="px-4 py-2 bg-[#1A5AF0] text-white rounded-lg font-bold"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="px-4 py-2 bg-gray-100 text-black rounded-lg font-bold"
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
                      zIndex: 9999,
                    },
                  },
                );
              }}
              className="px-8 py-3 bg-[#1A5AF0] text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
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