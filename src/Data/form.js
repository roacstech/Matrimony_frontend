import { useState } from "react";
import toast from "react-hot-toast";
import { submitFormAPI } from "../services/submitFormAPI";

export const useMatrimonyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    // STEP 0
    fullName: "",
    gender: "",
    dob: "",
    birthTime: "",
    birthPeriod: "",
    birthPlace: "",   // ✅ ADD THIS
    email: "",
    phone: "",
    maritalStatus: "",

    // STEP 1
    education: "",
    occupation: "",
    income: "",
    workLocation: "",

    // STEP 2
    father: "",
    mother: "",
    grandfather: "",
    grandmother: "",
    motherSideGrandfather: "",
    motherSideGrandmother: "",
    siblings: "",

    // STEP 3
    raasi: "",
    star: "",
    dosham: "",
    horoscope: null,

    // STEP 4
    address: "",
    city: "",
    country: "",

    // STEP 5
    privacy: "",
    photo: null,
    remarks: "",
  });

  // ✅ FIXED FIELD MAP
  const stepFields = [
    ["fullName", "gender", "dob", "birthTime", "birthPlace", "email", "phone", "maritalStatus"],
    ["education", "occupation", "income", "workLocation"],
    [
      "father",
      "mother",
      "grandfather",
      "grandmother",
      "motherSideGrandfather",
      "motherSideGrandmother",
      "siblings",
    ],
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

    const invalid = fields.some(
      (f) => !formData[f] || formData[f].toString().trim() === ""
    );

    if (invalid) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setCurrentStep((p) => p + 1);
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  const submitForm = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const res = await submitFormAPI(formData, token);
      toast.success(res.message || "Profile submitted");
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