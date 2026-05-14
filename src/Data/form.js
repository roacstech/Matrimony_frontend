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
    birthPlace: "",
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
    horoscope: null, // File object — used only for UI display, NOT sent to backend

    // STEP 4
    address: "",
    city: "",
    country: "",

    // STEP 5
    privacy: "",
    photo: null,     // File object — used only for UI display, NOT sent to backend
    remarks: "",
  });

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
    // Stores File object in formData only for UI (filename display, preview)
    // The actual upload to S3 happens in MatrimonyForm.jsx
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

  // ✅ FIXED: accepts { photoUrl, horoscopeUrl } from MatrimonyForm.jsx
  // These are the full S3 URLs uploaded before submit
  const submitForm = async ({ photoUrl, horoscopeUrl } = {}) => {
    try {
      const token = localStorage.getItem("accesstoken");

      // ✅ Build a clean JSON payload — no File objects, only S3 URLs
      const payload = {
        // STEP 0
        fullName:              formData.fullName,
        gender:                formData.gender,
        dob:                   formData.dob,
        birthTime:             formData.birthTime,
        birthPeriod:           formData.birthPeriod,
        birthPlace:            formData.birthPlace,
        email:                 formData.email,
        phone:                 formData.phone,
        maritalStatus:         formData.maritalStatus,

        // STEP 1
        education:             formData.education,
        occupation:            formData.occupation,
        income:                formData.income,
        workLocation:          formData.workLocation,

        // STEP 2
        father:                formData.father,
        mother:                formData.mother,
        grandfather:           formData.grandfather,
        grandmother:           formData.grandmother,
        motherSideGrandfather: formData.motherSideGrandfather,
        motherSideGrandmother: formData.motherSideGrandmother,
        siblings:              formData.siblings,

        // STEP 3
        raasi:                 formData.raasi,
        star:                  formData.star,
        dosham:                formData.dosham,

        // STEP 4
        address:               formData.address,
        city:                  formData.city,
        country:               formData.country,

        // STEP 5
        privacy:               formData.privacy,
        remarks:               formData.remarks,

        // ✅ S3 URLs — saved directly to DB as full URLs
        // e.g. https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/photos/uuid.jpg
        photoUrl:              photoUrl      || null,
        horoscopeUrl:          horoscopeUrl  || null,
      };

      console.log("📤 FINAL PAYLOAD TO BACKEND =>", payload);

      const res = await submitFormAPI(payload, token);
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