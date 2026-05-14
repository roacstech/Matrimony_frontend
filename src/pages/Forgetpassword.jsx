import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  KeyIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, resetPassword } from "../services/authService";

const ForgotPassword = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("All fields required");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await resetPassword({ email, newPassword });
      toast.success(res.data.message || "Password reset successful");
      setTimeout(() => onNavigate(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
      </div>

      {/* STEP 1: Email */}
      {step === 1 && (
        <form className="space-y-5" onSubmit={handleSendOtp}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-2xl text-white font-semibold transition-all disabled:opacity-70"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form className="space-y-5" onSubmit={handleVerifyOtp}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
            <div className="relative">
              <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-2xl text-white font-semibold transition-all disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {/* STEP 3: Reset Password */}
      {step === 3 && (
        <form className="space-y-5" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-2xl text-white font-semibold transition-all disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        Back to{' '}
        <button onClick={onNavigate} className="text-blue-600 font-semibold hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPassword;