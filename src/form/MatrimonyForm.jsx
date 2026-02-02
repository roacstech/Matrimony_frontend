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
  "சுருக்கம் / Summary",
];

const MatrimonyForm = () => {
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

  const input =
    "w-full px-4 py-3 rounded-xl border border-[#D4BEE4] bg-white text-[#3B1E54] focus:outline-none focus:ring-2 focus:ring-[#9B7EBD]";
  const uploadBox =
    "relative w-40 h-40 rounded-2xl bg-[#D4BEE4] flex items-center justify-center overflow-hidden shadow-md cursor-pointer mx-auto mt-4";

  return (
    <div className="min-h-screen bg-[#9B7EBD] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-3 overflow-hidden min-h-[600px]">
        {/* LEFT STEPPER */}
        <div className="bg-[#D4BEE4] p-8 text-[#3B1E54]">
          <h2 className="text-2xl font-bold mb-10">
            சுயவிவரம் உருவாக்கவும் / Create Profile
          </h2>
          <ul className="space-y-6">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                    i <= currentStep
                      ? "bg-[#3B1E54] text-white"
                      : "border border-[#3B1E54]/40 text-[#3B1E54]/50"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={
                    i === currentStep ? "font-bold" : "opacity-70 text-sm"
                  }
                >
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-2 p-8 md:p-12 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="font-semibold text-[#3B1E54]"
            >
              ← வெளியேறு / Exit
            </button>
            <span className="text-sm text-[#3B1E54]/70 font-bold">
              படி {currentStep + 1} / Step {currentStep + 1} of 7
            </span>
          </div>

          <h3 className="text-2xl font-bold text-[#3B1E54] mb-8">
            {steps[currentStep]}
          </h3>

          <div className="flex-1 min-h-[350px]">
            {/* STEP 0 */}
            {currentStep === 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="fullName"
                  placeholder="முழு பெயர் / Full Name"
                  onChange={handleChange}
                  value={formData.fullName}
                />
                <select
                  className={input}
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <option value="">பாலினம் / Gender</option>
                  <option>ஆண் / Male</option>
                  <option>பெண் / Female</option>
                </select>
                <input
                  type="date"
                  className={input}
                  name="dob"
                  onChange={handleChange}
                  value={formData.dob}
                />
                <input
                  type="time"
                  className={input}
                  name="birthTime"
                  onChange={handleChange}
                  value={formData.birthTime}
                />
                <select
                  className={input}
                  name="maritalStatus"
                  onChange={handleChange}
                  value={formData.maritalStatus}
                >
                  <option value="">திருமண நிலை / Marital Status</option>
                  <option>திருமணம் ஆகாதவர்</option>
                  <option>விவாகரத்து பெற்றவர்</option>
                  <option>விதவை / விதவர்</option>
                </select>
              </div>
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="education"
                  placeholder="கல்வி / Education"
                  onChange={handleChange}
                  value={formData.education}
                />
                <input
                  className={input}
                  name="occupation"
                  placeholder="தொழில் / Occupation"
                  onChange={handleChange}
                  value={formData.occupation}
                />
                <input
                  className={input}
                  name="income"
                  placeholder="வருமானம் / Income"
                  onChange={handleChange}
                  value={formData.income}
                />
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="father"
                  placeholder="Father Name"
                  onChange={handleChange}
                  value={formData.father}
                />
                <input
                  className={input}
                  name="mother"
                  placeholder="Mother Name"
                  onChange={handleChange}
                  value={formData.mother}
                />
                <input
                  className={input}
                  name="grandfather"
                  placeholder="Grandfather Name"
                  onChange={handleChange}
                  value={formData.grandfather}
                />
                <input
                  className={input}
                  name="grandmother"
                  placeholder="Grandmother Name"
                  onChange={handleChange}
                  value={formData.grandmother}
                />
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    className={input}
                    name="raasi"
                    placeholder="Raasi"
                    onChange={handleChange}
                    value={formData.raasi}
                  />
                  <input
                    className={input}
                    name="star"
                    placeholder="Star"
                    onChange={handleChange}
                    value={formData.star}
                  />
                  <input
                    className={input}
                    name="dosham"
                    placeholder="Dosham (if any)"
                    onChange={handleChange}
                    value={formData.dosham}
                  />
                  <input
                    className={input}
                    name="religion"
                    placeholder="Religion"
                    onChange={handleChange}
                    value={formData.religion}
                  />
                  <input
                    className={input}
                    name="caste"
                    placeholder="Caste"
                    onChange={handleChange}
                    value={formData.caste}
                  />
                </div>

                <div className={uploadBox}>
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    {formData.horoscope ? (
                      <>
                        <DocumentCheckIcon className="w-10 h-10 text-green-600" />
                        <p className="text-xs mt-2 text-center">
                          {formData.horoscope.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="w-10 h-10 text-[#9B7EBD]" />
                        <p className="text-xs text-center mt-2">
                          Upload Horoscope (Optional)
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

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  className={input}
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  value={formData.address}
                />
                <input
                  className={input}
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  value={formData.city}
                />
                <input
                  className={input}
                  name="country"
                  placeholder="Country"
                  onChange={handleChange}
                  value={formData.country}
                />
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-6 border border-gray-100">
  
  {/* Privacy Dropdown Section */}
  <div className="space-y-2">
    <label htmlFor="privacy" className="block text-sm font-semibold text-gray-700">
      Account Settings
    </label>
    <div className="relative">
      <select
        id="privacy"
        name="privacy"
        onChange={handleChange}
        className="block w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
      >
                <option value="Friends">Non-n</option>

        <option value="Public">🌍 Public</option>
        <option value="Private">🔒 Private</option>
      </select>
      
      {/* Custom Arrow Icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  {/* Photo Upload Section */}
  <div className="space-y-2">
    <p className="text-sm font-semibold text-gray-700">Upload Photo</p>
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 transition-all">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <p className="text-sm text-gray-500">Click to upload photo</p>
      </div>
      <input type="file" name="photo" className="hidden" onChange={handleFileChange} />
    </label>
  </div>

</div>
            )}

            {/* STEP 6 */}
            {currentStep === 6 && (
              <div className="space-y-2 bg-[#D4BEE4]/30 p-6 rounded-xl">
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
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between mt-8 border-t pt-6">
<button
  onClick={prevStep}
  className={`${
    currentStep === 0 ? "invisible" : "flex items-center gap-2"
  } px-5 py-2.5 bg-[#3B1E54] text-white rounded-xl font-bold`}
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
  Back
</button>
          <button
  onClick={() => {
    // Normal next
    if (currentStep !== 6) {
      nextStep();
      return;
    }

    // Confirmation toast
    toast(
      (t) => (
        <div className="text-center space-y-3">
          <p className="font-bold text-[#3B1E54]">
            உறுதியாக சமர்ப்பிக்கலாமா? <br />
            Are you sure to submit?
          </p>

          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                submitForm();

                // 🔥 redirect to home page
                setTimeout(() => {
                  navigate("/");
                }, 800); // small delay for success toast
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold"
            >
              Confirm
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-300 rounded-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  }}
  className="px-8 py-3 bg-[#3B1E54] text-white rounded-xl font-bold"
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
