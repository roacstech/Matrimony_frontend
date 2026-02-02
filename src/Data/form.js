import { useState } from "react";
import toast from "react-hot-toast";

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

  // 🔥 Mandatory fields per step
  const stepFields = [
    ["fullName", "gender", "dob", "birthTime", "maritalStatus"],
    ["education", "occupation", "income"],
    ["father", "mother", "grandfather", "grandmother"],
    ["raasi", "star", "dosham"],
    ["address", "city", "country"],
    ["privacy"],
  ];

  // =====================
  // INPUT HANDLERS
  // =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files[0] }));
  };

  // =====================
  // STEP VALIDATION
  // =====================
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

  // =====================
  // FINAL SUBMIT
  // =====================
  const submitForm = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      toast.error("Please login again");
      return;
    }

    // 1️⃣ SAVE TO PENDING PROFILES (ADMIN VIEW)
    const pending =
      JSON.parse(localStorage.getItem("pending_profiles")) || [];

    pending.push({
      id: currentUser.id,
      email: currentUser.email,
      status: "PENDING",
      profile: formData,
      submittedAt: new Date().toISOString(),
    });

    localStorage.setItem(
      "pending_profiles",
      JSON.stringify(pending)
    );

    // 2️⃣ UPDATE USER STATUS → PENDING
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? {
            ...u,
            hasSubmittedForm: true,
            status: "PENDING", // 🔥 BLOCK NEXT LOGIN
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // 3️⃣ UPDATE CURRENT USER
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        ...currentUser,
        hasSubmittedForm: true,
        status: "PENDING",
      })
    );

    toast.success("Profile submitted for admin approval ⏳");
  };

  // =====================
  // RETURN
  // =====================
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
