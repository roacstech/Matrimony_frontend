

import axiosInstance from "./axiosMiddleware";

export const registerUser = (data) => {
  console.log("REGISTER API CALL 🔥");
  
  return axiosInstance.post("auth/register", data);
  
};

export const loginUser = (data) => {
  return axiosInstance.post("auth/login", data);
};
