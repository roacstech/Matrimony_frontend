// import { useState } from "react";
// import toast from "react-hot-toast";

// export const useMatrimonyForm = () => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     gender: "",
//     dob: "",
//     birthTime: "",
//     maritalStatus: "",
//     education: "",
//     occupation: "",
//     income: "",
//     father: "",
//     mother: "",
//     grandfather: "",
//     grandmother: "",
//     siblings:"",
//     raasi: "",
//     star: "",
//     dosham: "",
//     religion: "",
//     caste: "",
//     horoscope: null,
//     address: "",
//     city: "",
//     country: "",
//     privacy: "",
//     photo: null,
//   });

//   // 🔥 Mandatory fields per step
//   const stepFields = [
//     ["fullName", "gender", "dob", "birthTime", "maritalStatus"],
//     ["education", "occupation", "income"],
//     ["father", "mother", "grandfather", "grandmother","siblings"],
//     ["raasi", "star", "dosham"],
//     ["address", "city", "country"],
//     ["privacy"],
//   ];

//   // =====================
//   // INPUT HANDLERS
//   // =====================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((p) => ({ ...p, [name]: files[0] }));
//   };

//   // =====================
//   // STEP VALIDATION
//   // =====================
//   const validateStep = () => {
//     const fields = stepFields[currentStep];
//     if (!fields) return true;
//     return fields.every((f) => formData[f]);
//   };

//   const nextStep = () => {
//     if (!validateStep()) {
//       toast.error("Please fill all required fields");
//       return;
//     }
//     setCurrentStep((p) => p + 1);
//   };


//   const prevStep = () => {
//     setCurrentStep((p) => Math.max(p - 1, 0));
//   };

//   // =====================
//   // FINAL SUBMIT
//   // =====================
// const submitForm = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch("http://localhost:5000/api/user/form/submit", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       toast.error(data.message || "Submit failed");
//       return;
//     }

//     toast.success("Profile submitted for admin approval ⏳");
//   } catch (err) {
//     toast.error("Server error");
//   }
// };

//   // =====================
//   // RETURN
//   // =====================
//   return {
//     currentStep,
//     formData,
//     handleChange,
//     handleFileChange,
//     nextStep,
//     prevStep,
//     submitForm,
//   };
// };


import { useState } from "react";
import toast from "react-hot-toast";
import { submitFormAPI } from "../services/submitFormAPI";

export const useMatrimonyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    birthTime: "",
    maritalStatus: "",
    education: "",
    occupation: "",
    income: "",
    father: "",
    mother: "",
    grandfather: "",
    grandmother: "",
    siblings: "",
    raasi: "",
    star: "",
    dosham: "",
    religion: "",
    caste: "",
    horoscope: null,
    address: "",
    city: "",
    country: "",
    privacy: "",
    photo: null,
  });

  const stepFields = [
    ["fullName", "gender", "dob", "birthTime", "maritalStatus"],
    ["education", "occupation", "income"],
    ["father", "mother", "grandfather", "grandmother", "siblings"],
    ["raasi", "star", "dosham"],
    ["address", "city", "country"],
    ["privacy"],
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files[0] }));
  };

  const validateStep = () => {
    const fields = stepFields[currentStep];
    if (!fields) return true;
    return fields.every((f) => formData[f]);
  };

  const nextStep = () => {
    if (!validateStep()) {
      toast.error("Please fill all required fields");
      return;
    }
    setCurrentStep((p) => p + 1);
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  // ✅ FINAL SUBMIT (CLEAN)
  const submitForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await submitFormAPI(formData, token);
      toast.success(res.message || "Profile submitted ⏳");
    } catch (err) {
      toast.error(err.message || "Submit failed");
    }
  };

  return {
    currentStep,
    formData,
    handleChange,
    handleFileChange,
    nextStep,
    prevStep,
    submitForm,
  };
};
