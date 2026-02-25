

import axiosInstance from "./axiosMiddleware";

export const registerUser = (data) => {
  console.log("REGISTER API CALL 🔥");
  
  return axiosInstance.post("auth/register", data);
  
};

export const loginUser = (data) => {
  return axiosInstance.post("auth/login", data);
};


/* ================= FORGOT PASSWORD ================= */

export const sendOtp = (data) => {
  return axiosInstance.post("/auth/forgot-password", data);
};

export const verifyOtp = (data) => {
  return axiosInstance.post("/auth/verify-otp", data);
};

export const resetPassword = (data) => {
  return axiosInstance.post("/auth/reset-password", data);
};