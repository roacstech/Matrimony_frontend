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

  try {
    const input = formData.email;

    const payload = {
      password: formData.password,
    };

    // check if input is number (phone) or email
    if (/^\d+$/.test(input)) {
      payload.phone = input;
    } else {
      payload.email = input;
    }

    const res = await loginUser(payload);

    const token = res.data.response;

    if (!token) {
      toast.error("Login failed");
      return;
    }

    const decoded = jwtDecode(token);

    localStorage.setItem("accesstoken", token);
    localStorage.setItem("roleid", res.data.roleid);
    localStorage.setItem("userid", decoded.userid);

    toast.success("Login successful");
    navigate("/user/dashboard");

  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};



  return {
    formData,
    handleChange,
    handleRegisterSubmit,
    handleLoginSubmit,
  };
};
