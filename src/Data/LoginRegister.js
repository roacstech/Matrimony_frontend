


import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser, loginUser } from "../services/authService";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  // =====================
  // INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =====================
  // REGISTER
  // =====================
  const handleRegisterSubmit = async (e, onNavigate) => {
    
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const res = await registerUser({
        name: formData.fullName,
        phone: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.data.message || "🎉 Registration successful");

      setTimeout(() => {
        isSubmittingRef.current = false;
        if (onNavigate) onNavigate();
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      isSubmittingRef.current = false;
    }
  };

  // =====================
  // LOGIN (EMAIL OR MOBILE)
  // =====================
  const handleLoginSubmit = async (e) => {
    
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const res = await loginUser({
        email: formData.email, // email OR mobile number
        password: formData.password,
      });

      const { response, roleid } = res.data;
      console.log("ROLEID 👉", roleid);
console.log("NAVIGATING...");
console.log("FULL LOGIN RESPONSE 👉", res.data);


 // 🔹 get status from localStorage (backend change இல்ல)
      const status = localStorage.getItem("status") || "NEW";

      localStorage.setItem("accesstoken", response);
      localStorage.setItem("roleid", roleid);
      // localStorage.setItem("userid", userid);

      

      toast.success("✅ Login successful");
      

    
        if (Number(roleid) === 1) {
          // Admin
          navigate("/admin");
        } else {
          // Normal user
          if (status === "NEW") {
            navigate("/form");
          } else if (status === "PENDING") {
            navigate("/");
            toast("⏳ Admin approval pending. Please wait.", {
              icon: "⏳",
              duration: 4000,
            });
          } else if (status === "ACTIVE") {
            navigate("/dashboard");
          } else {
            navigate("/form"); // fallback
          }
        }
      
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      isSubmittingRef.current = false;
    }
  };

  return {
    formData,
    handleChange,
    handleRegisterSubmit,
    handleLoginSubmit,
  };
};
