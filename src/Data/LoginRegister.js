import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser, loginUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";

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

      toast.dismiss();
      toast.success(res.data.message || "🎉 Registration successful");

      setTimeout(() => {
        isSubmittingRef.current = false;
        if (onNavigate) onNavigate();
      }, 500);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Registration failed");
      isSubmittingRef.current = false;
    }
  };

  // =====================
  // LOGIN
  // =====================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { response, roleid, status } = res.data;

      // 🔑 Decode JWT safely
      const decoded = jwtDecode(response);

      // 🔐 Store auth data
      localStorage.setItem("accesstoken", response);
      localStorage.setItem("roleid", roleid);
      localStorage.setItem("status", status);
      localStorage.setItem("userid", decoded.userid);

      toast.dismiss();

      // =====================
      // ADMIN
      // =====================
      if (Number(roleid) === 1) {
        toast.success("✅ Admin login successful");
        setTimeout(() => navigate("/admin"), 300);
      }

      // =====================
      // USER
      // =====================
      else if (Number(roleid) === 2) {
        if (status === "NEW") {
          toast.success("✅ Login successful");
          setTimeout(() => navigate("/form"), 300);
        } 
        else if (status === "PENDING") {
          toast("⏳ Admin approval pending. Please wait.");
          setTimeout(() => navigate("/"), 300);
        } 
        else if (status === "ACTIVE") {
          toast.success("✅ Login successful");
          setTimeout(() => navigate("/user/dashboard"), 300);
        } 
        else if (status === "REJECTED") {
          toast.error("❌ Your profile was rejected by admin");
          setTimeout(() => navigate("/"), 300);
        }
      }

      isSubmittingRef.current = false;
    } catch (err) {
      toast.dismiss();
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
