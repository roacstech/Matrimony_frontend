import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e, onNavigate) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some(
      (u) =>
        u.email === formData.email ||
        u.mobileNumber === formData.mobileNumber
    );

    if (exists) {
      toast.error("⚠️ Email or Mobile already registered");
      isSubmittingRef.current = false;
      return;
    }

    const role = formData.email === "admin@gmail.com" ? 1 : 2;

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      password: formData.password,
      role,
      status: "APPROVED",
      hasSubmittedForm: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("🎉 Signup successful!");

    setTimeout(() => {
      isSubmittingRef.current = false;
      if (onNavigate) onNavigate();
    }, 1000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) =>
        (u.email === formData.email ||
          u.mobileNumber === formData.email) &&
        u.password === formData.password
    );

    if (!foundUser) {
      toast.error("❌ Invalid credentials");
      isSubmittingRef.current = false;
      return;
    }

    if (foundUser.role === 2 && foundUser.status !== "APPROVED") {
      toast.error("⏳ Admin approval pending");
      isSubmittingRef.current = false;
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    toast.success("Login successful");

    setTimeout(() => {
      isSubmittingRef.current = false;

      if (foundUser.role === 1) {
        navigate("/admin");
      } else if (!foundUser.hasSubmittedForm) {
        navigate("/form");
      } else {
        navigate("/user/dashboard");
      }
    }, 800);
  };

  return {
    formData,
    handleChange,
    handleRegisterSubmit,
    handleLoginSubmit,
  };
};
