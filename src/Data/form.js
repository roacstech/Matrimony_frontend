


import { useState } from "react";
import toast from "react-hot-toast";
import { submitFormAPI } from "../services/submitFormAPI";

export const useMatrimonyForm = () => {
    console.log("🔥 useMatrimonyForm called");
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
      const token = localStorage.getItem("accesstoken");
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
