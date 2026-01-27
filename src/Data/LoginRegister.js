import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAuthForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  // =====================
  // COMMON INPUT HANDLER
  // =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =====================
  // REGISTER
  // =====================
  const handleRegisterSubmit = (e, onNavigate) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Email OR Mobile already exists check
    const exists = users.some(
      (u) =>
        u.email === formData.email ||
        u.mobileNumber === formData.mobileNumber
    );

    if (exists) {
      toast.error("⚠️ Email or Mobile already registered");
      return;
    }

    // Role logic
    const role = formData.email === "admin@gmail.com" ? 1 : 2;

    const newUser = {
      id: Date.now(), // unique ID
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      password: formData.password,
      role, // 1 = admin, 2 = user
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("🎉 Signup successful! Redirecting to login...");

    // ⏳ small delay → switch to login UI
    setTimeout(() => {
      if (onNavigate) onNavigate(); // setView('login')
    }, 1500);
  };

  // =====================
  // LOGIN (EMAIL OR MOBILE)
  // =====================
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) =>
        (u.email === formData.email || // email login
          u.mobileNumber === formData.email) && // mobile login
        u.password === formData.password
    );

    if (!foundUser) {
      toast.error("❌ Invalid Email/Mobile or Password");
      return;
    }

    // Store logged-in user
    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    toast.success(
      foundUser.role === 1
        ? "👑 Admin login successful"
        : "✅ Login successful"
    );

    // 🔁 Redirect to Matrimony Form page
    setTimeout(() => {
      navigate("/form");
    }, 1000);
  };

  return {
    formData,
    handleChange,
    handleLoginSubmit,
    handleRegisterSubmit,
  };
};
