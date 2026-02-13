import React from "react";
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
  // "சுருக்கம் / Summary",
];

const MatrimonyForm = () => {
  console.log("🔥 MATRIMONY FORM RENDERED");
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
  />
</div>


       
               <div className="flex items-center gap-3">
 <div className="relative w-full">
  {!formData.birthTime && (
    <span className="absolute left-3 top-1 text-[#5D4037]  pointer-events-none">
      Birth Time / பிறந்த நேரம்
    </span>
  )}

  <input
    type="time"
    name="birthTime"
    value={formData.birthTime}
    onChange={handleChange}
    className="w-full rounded-md border border-gray-300 px-3 pt-6 pb-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
  />
</div>


  <select
    name="birthPeriod"
    value={formData.birthPeriod}
    onChange={handleChange}
    className="w-20 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
  >
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
  <option value="Mirugasheeridam">மிருகசீரிடம் (Mirugasheeridam)</option>
  <option value="Thiruvathirai">திருவாதிரை (Thiruvathirai)</option>
  <option value="Punarpoosam">புனர்பூசம் (Punarpoosam)</option>
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
  <option value="Uthirattathi">உத்திரட்டாதி (Uthirattathi)</option>
  <option value="Revathi">ரேவதி (Revathi)</option>
</select>

                 <select
  className={input}
  name="dosham"
  onChange={handleChange}
  value={formData.dosham}
>
  <option value="">Dosham / தோஷாம்</option>
  <option value="No">Sevvai  / செவ்வாய்</option>
  <option value="Yes">Kethu  / கேது </option>
    <option value="No"> Raagu / ராகு</option>
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
                  placeholder="Address / முகவரி"
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
                    Upload Photo /  பதிவேற்ற புகைப்படம்
                  </p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#FAF6F3] hover:bg-[#EEEEEE] border-[#A67C52]/30 transition-all">
                    <CloudArrowUpIcon className="w-8 h-8 mb-2 text-[#A67C52]" />
                    <p className="text-sm text-[#5D4037] text-center">
                      Click to upload photo /  புகைப்படத்தை பதிவேற்ற கிளிக் செய்க
                    </p>
                    <input
                      type="file"
                      name="photo"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 6 - Summary */}
            {/* {currentStep === 6 && (
              <div className="space-y-2 bg-[#EEEEEE]/50 p-6 rounded-xl border border-[#A67C52]/20 text-[#5D4037]">
                <p>
                  <b>Name:</b> {formData.fullName}
                </p>
                <p>
                  <b>Education:</b> {formData.education}
                </p>
                <p>
                  <b>Raasi:</b> {formData.raasi}
                </p>
                <p>
                  <b>Account:</b> {formData.privacy}
                </p>
              </div>
            )} */}
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
    if (currentStep !== 5) {
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
          marginLeft:
          "55vw", // 👈 center feel
          zIndex: 9999,      // 👈 front-la varum
        },
      }
    );
  }}
  className="px-8 py-3 bg-[#573D2F] text-white rounded-xl font-bold hover:bg-[#5D4037] transition-all"
>
  {currentStep === 5 ? "Submit" : "Next"}
</button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrimonyForm;


