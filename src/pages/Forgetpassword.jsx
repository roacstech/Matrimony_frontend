import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../services/authService";

const ForgotPassword = ({ onNavigate }) => {
    const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email required");

    setLoading(true);
    try {
      const res = await sendOtp({ email });
      toast.success(res.data.message || "OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("OTP required");

    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("All fields required");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await resetPassword({
        email,
        newPassword,
      });
      onNavigate(); // ✅ Navigate first

    toast.success(res.data.message || "Password reset successful", {
  duration: 2000,
});

setTimeout(() => {
  onNavigate();
}, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full sm:w-[90%] md:w-[70%] lg:w-[800px]
      bg-white/95 backdrop-blur-xl
      rounded-[30px] md:rounded-[40px]
      p-8 md:p-10
      shadow-[0_20px_50px_rgba(93,64,55,0.1)]
      border border-[#EEEEEE]
      transition-all duration-300"
    >
      {/* TITLE */}
      <div className="mb-6">
        <p className="font-bold text-xl md:text-2xl text-[#5D4037]">
          Forgot Password
        </p>
      </div>

      {/* STEP 1: EMAIL */}
      {step === 1 && (
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div className="group relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5
              bg-[#EEEEEE]/30 border border-[#EEEEEE]
              rounded-xl focus:bg-white
              focus:border-[#5D4037] focus:outline-none
              transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#573D2F] text-white py-3.5 rounded-xl font-bold
            shadow-lg hover:bg-[#5D4037] transition-all
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form className="space-y-4" onSubmit={handleVerifyOtp}>
          <div className="group relative">
            <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5
              bg-[#EEEEEE]/30 border border-[#EEEEEE]
              rounded-xl focus:bg-white
              focus:border-[#5D4037] focus:outline-none
              transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#573D2F] text-white py-3.5 rounded-xl font-bold
            shadow-lg hover:bg-[#5D4037] transition-all
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === 3 && (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div className="group relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5
              bg-[#EEEEEE]/30 border border-[#EEEEEE]
              rounded-xl focus:bg-white
              focus:border-[#5D4037] focus:outline-none
              transition-all text-sm"
              required
            />
          </div>

          <div className="group relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5
              bg-[#EEEEEE]/30 border border-[#EEEEEE]
              rounded-xl focus:bg-white
              focus:border-[#5D4037] focus:outline-none
              transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#573D2F] text-white py-3.5 rounded-xl font-bold
            shadow-lg hover:bg-[#5D4037] transition-all
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {/* BACK TO LOGIN */}
      <p className="text-sm text-gray-500 mt-6 font-medium">
        Back to
     <button
  type="button"
  onClick={onNavigate}
  className="text-[#A67C52] font-bold hover:text-[#5D4037] hover:underline ml-1"
>
  Login
</button>
      </p>
    </div>
  );
};

export default ForgotPassword;