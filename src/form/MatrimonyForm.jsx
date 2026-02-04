// import React from "react";
// import toast from "react-hot-toast";

// import {
//   CloudArrowUpIcon,
//   DocumentCheckIcon,
// } from "@heroicons/react/24/outline";
// import { useMatrimonyForm } from "../Data/form";
// import { useNavigate } from "react-router-dom";

// const steps = [
//   "தனிப்பட்ட விவரங்கள் / Personal Details",
//   "கல்வி & தொழில் / Education & Career",
//   "குடும்ப விவரங்கள் / Family Details",
//   "ஜாதக விவரங்கள் / Horoscope Details",
//   "முகவரி விவரங்கள் / Address Details",
//   "சுயவிவர தனியுரிமை / Profile Visibility",
//   "சுருக்கம் / Summary",
// ];

// const MatrimonyForm = () => {
//   const navigate = useNavigate();
//   const {
//     currentStep,
//     formData,
//     handleChange,
//     handleFileChange,
//     nextStep,
//     prevStep,
//     submitForm,
//   } = useMatrimonyForm();

//   // Color Patterns applied to constants
//   const input =
//     "w-full px-4 py-3 rounded-xl border border-[#EEEEEE] bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#A67C52]";
//   const uploadBox =
//     "relative w-40 h-40 rounded-2xl bg-[#EEEEEE]/50 flex items-center justify-center overflow-hidden shadow-md cursor-pointer mx-auto mt-4 border-2 border-dashed border-[#A67C52]/30";

//   return (
//     // Outer Background: Cream #FAF6F3
//     <div className="min-h-screen bg-[#FAF6F3] flex items-center justify-center p-6">
//       <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-3 overflow-hidden min-h-[600px]">
//         {/* LEFT STEPPER: Using Brown tones #5D4037 & Soft Grey #EEEEEE */}
//         <div className="bg-[#EEEEEE] p-8 text-[#5D4037]">
//           <h2 className="text-2xl font-bold mb-10">
//             சுயவிவரம் உருவாக்கவும் / Create Profile
//           </h2>
//           <ul className="space-y-6">
//             {steps.map((s, i) => (
//               <li key={i} className="flex items-center gap-4">
//                 <div
//                   className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors ${
//                     i <= currentStep
//                       ? "bg-[#5D4037] text-white" // Active step Brown
//                       : "border border-[#5D4037]/40 text-[#5D4037]/50"
//                   }`}
//                 >
//                   {i + 1}
//                 </div>
//                 <span
//                   className={
//                     i === currentStep
//                       ? "font-bold text-[#5D4037]"
//                       : "opacity-70 text-sm"
//                   }
//                 >
//                   {s}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* RIGHT FORM SECTION */}
//         <div className="md:col-span-2 p-8 md:p-12 flex flex-col h-full">
//           <div className="flex justify-between items-center mb-6">
//             <button
//               onClick={() => navigate(-1)}
//               className="font-semibold text-[#5D4037] hover:text-[#A67C52] transition-colors"
//             >
//               ← வெளியேறு / Exit
//             </button>
//             <span className="text-sm text-[#5D4037]/70 font-bold">
//               படி {currentStep + 1} / Step {currentStep + 1} of 7
//             </span>
//           </div>

//           <h3 className="text-2xl font-bold text-[#5D4037] mb-8 border-b border-[#EEEEEE] pb-2">
//             {steps[currentStep]}
//           </h3>

//           <div className="flex-1 min-h-[350px]">
//             {/* STEP 0 - Personal */}
//             {currentStep === 0 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <input
//                   className={input}
//                   name="fullName"
//                   placeholder="Full Name"
//                   onChange={handleChange}
//                   value={formData.fullName}
//                 />
//                 <select
//                   className={input}
//                   name="gender"
//                   onChange={handleChange}
//                   value={formData.gender}
//                 >
//                   <option value="">Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//                 <input
//                   type="date"
//                   className={input}
//                   name="dob"
//                   onChange={handleChange}
//                   value={formData.dob}
//                 />
//                <div className="flex items-center gap-3">
//   <input
//     type="time"
//     name="birthTime"
//     value={formData.birthTime}
//     onChange={handleChange}
//     className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//   />

//   <select
//     name="birthPeriod"
//     value={formData.birthPeriod}
//     onChange={handleChange}
//     className="w-20 rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//   >
//     <option value="AM">AM</option>
//     <option value="PM">PM</option>
//   </select>
// </div>

//                 <input
//                   className={input}
//                   name="email"
//                   placeholder="Email"
//                   onChange={handleChange}
//                   value={formData.email}
//                 />

//                 <select
//                   className={input}
//                   name="maritalStatus"
//                   onChange={handleChange}
//                   value={formData.maritalStatus}
//                 >
//                   <option value="">Marital Status</option>
//                   <option value="Unmarried">Unmarried</option>
//                   <option value="Divorced">Divorced</option>
//                   <option value="Widowed">Widowed</option>
//                 </select>
//               </div>
//             )}

//             {/* STEP 1 - Career */}
//             {currentStep === 1 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <input
//                   className={input}
//                   name="education"
//                   placeholder="Education"
//                   onChange={handleChange}
//                   value={formData.education}
//                 />
//                 <input
//                   className={input}
//                   name="occupation"
//                   placeholder="Occupation"
//                   onChange={handleChange}
//                   value={formData.occupation}
//                 />
//                 <input
//                   className={input}
//                   name="income"
//                   placeholder="Income"
//                   onChange={handleChange}
//                   value={formData.income}
//                 />
//               </div>
//             )}

//             {/* STEP 2 - Family */}
//             {currentStep === 2 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <input
//                   className={input}
//                   name="father"
//                   placeholder="Father Name"
//                   onChange={handleChange}
//                   value={formData.father}
//                 />
//                 <input
//                   className={input}
//                   name="mother"
//                   placeholder="Mother Name"
//                   onChange={handleChange}
//                   value={formData.mother}
//                 />
//                 <input
//                   className={input}
//                   name="grandfather"
//                   placeholder="Grandfather Name"
//                   onChange={handleChange}
//                   value={formData.grandfather}
//                 />
//                 <input
//                   className={input}
//                   name="grandmother"
//                   placeholder="Grandmother Name"
//                   onChange={handleChange}
//                   value={formData.grandmother}
//                 />
//                 <input
//                   className={input}
//                   name="siblings"
//                   placeholder="Siblings"
//                   type="number"
//                   onChange={handleChange}
//                   value={formData.siblings}
//                 />
//               </div>
//             )}

//             {/* STEP 3 - Horoscope */}
//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <input
//                     className={input}
//                     name="raasi"
//                     placeholder="Raasi"
//                     onChange={handleChange}
//                     value={formData.raasi}
//                   />
//                   <input
//                     className={input}
//                     name="star"
//                     placeholder="Star"
//                     onChange={handleChange}
//                     value={formData.star}
//                   />
//                   <input
//                     className={input}
//                     name="dosham"
//                     placeholder="Dosham"
//                     onChange={handleChange}
//                     value={formData.dosham}
//                   />
//                   <input
//                     className={input}
//                     name="religion"
//                     placeholder="Religion"
//                     onChange={handleChange}
//                     value={formData.religion}
//                   />
//                   <input
//                     className={input}
//                     name="caste"
//                     placeholder="Caste"
//                     onChange={handleChange}
//                     value={formData.caste}
//                   />
//                 </div>
//                 <div className={uploadBox}>
//                   <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
//                     {formData.horoscope ? (
//                       <>
//                         <DocumentCheckIcon className="w-10 h-10 text-green-600" />
//                         <p className="text-xs mt-2 text-center text-[#5D4037]">
//                           {formData.horoscope.name}
//                         </p>
//                       </>
//                     ) : (
//                       <>
//                         <CloudArrowUpIcon className="w-10 h-10 text-[#A67C52]" />
//                         <p className="text-xs text-center mt-2 text-[#5D4037]">
//                           Upload Horoscope
//                         </p>
//                       </>
//                     )}
//                     <input
//                       type="file"
//                       name="horoscope"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/* STEP 4 - Address */}
//             {currentStep === 4 && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 <input
//                   className={input}
//                   name="address"
//                   placeholder="Address"
//                   onChange={handleChange}
//                   value={formData.address}
//                 />
//                 <input
//                   className={input}
//                   name="city"
//                   placeholder="City"
//                   onChange={handleChange}
//                   value={formData.city}
//                 />
//                 <input
//                   className={input}
//                   name="country"
//                   placeholder="Country"
//                   onChange={handleChange}
//                   value={formData.country}
//                 />
//               </div>
//             )}

//             {/* STEP 5 - Visibility */}
//             {currentStep === 5 && (
//               <div className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-6 border border-[#EEEEEE]">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-[#5D4037]">
//                     Account Settings
//                   </label>
//                   <select
//                     name="privacy"
//                     onChange={handleChange}
//                     className={input}
//                   >
//                     <option value="">Select</option>
//                     <option value="Public">🌍 Public</option>
//                     <option value="Private">🔒 Private</option>
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm font-semibold text-[#5D4037]">
//                     Upload Photo
//                   </p>
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#FAF6F3] hover:bg-[#EEEEEE] border-[#A67C52]/30 transition-all">
//                     <CloudArrowUpIcon className="w-8 h-8 mb-2 text-[#A67C52]" />
//                     <p className="text-sm text-[#5D4037]">
//                       Click to upload photo
//                     </p>
//                     <input
//                       type="file"
//                       name="photo"
//                       className="hidden"
//                       onChange={handleFileChange}
//                     />
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/* STEP 6 - Summary */}
//             {currentStep === 6 && (
//               <div className="space-y-2 bg-[#EEEEEE]/50 p-6 rounded-xl border border-[#A67C52]/20 text-[#5D4037]">
//                 <p>
//                   <b>Name:</b> {formData.fullName}
//                 </p>
//                 <p>
//                   <b>Education:</b> {formData.education}
//                 </p>
//                 <p>
//                   <b>Raasi:</b> {formData.raasi}
//                 </p>
//                 <p>
//                   <b>Account:</b> {formData.privacy}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* BUTTONS: Using Login Button Brown #573D2F */}
//           <div className="flex justify-between mt-8 border-t border-[#EEEEEE] pt-6">
//             <button
//               onClick={prevStep}
//               className={`${
//                 currentStep === 0 ? "invisible" : "flex items-center gap-2"
//               } px-5 py-2.5 bg-[#EEEEEE] text-[#5D4037] rounded-xl font-bold hover:bg-[#A67C52] hover:text-white transition-all`}
//             >
//               Back
//             </button>
//             <button
//               onClick={() => {
//                 if (currentStep !== 6) {
//                   nextStep();
//                   return;
//                 }
//                 toast(
//                   (t) => (
//                     <div className="text-center space-y-3">
//                       <p className="font-bold text-[#5D4037]">
//                         Are you sure to submit?
//                       </p>
//                       <div className="flex justify-center gap-4 mt-3">
//                         <button
//                           onClick={() => {
//                             toast.dismiss(t.id);
//                             submitForm();
//                             setTimeout(() => navigate("/"), 800);
//                           }}
//                           className="px-4 py-2 bg-[#573D2F] text-white rounded-lg font-bold"
//                         >
//                           Confirm
//                         </button>
//                         <button
//                           onClick={() => toast.dismiss(t.id)}
//                           className="px-4 py-2 bg-[#EEEEEE] rounded-lg font-bold"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ),
//                   { duration: Infinity },
//                 );
//               }}
//               className="px-8 py-3 bg-[#573D2F] text-white rounded-xl font-bold hover:bg-[#5D4037] shadow-lg transition-all"
//             >
//               {currentStep === 6 ? "Submit" : "Next"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MatrimonyForm;


import React from 'react'

const MatrimonyForm = () => {
  return (
    <div>MatrimonyForm</div>
  )
}

export default MatrimonyForm