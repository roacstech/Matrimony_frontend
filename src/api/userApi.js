import { Profiler } from "react";

// const BASE_URL = "http://localhost:5000/api/user";
// const token = localStorage.getItem("accesstoken");
// console.log("token test", token);
// const getAuthHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
// });
// const authHeader = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${token}`,
// };

// base url
const BASE_URL = "http://localhost:5000/api/user";

// 🔑 ONE key name – use this everywhere
const TOKEN_KEY = "accesstoken";


// // get token
// const token = localStorage.getItem(TOKEN_KEY);
// console.log("token test:", token);

// auth header function
const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
});

export { BASE_URL, getAuthHeader };

export async function getVisibleConnections() {
  const token = localStorage.getItem("accesstoken");
  const res = await fetch(`${BASE_URL}/connections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

export async function getUserProfile(userId) {
   const token = localStorage.getItem("accesstoken");
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}




export async function sendConnectionRequest(profileId, toUserId) {
  const res = await fetch(`${BASE_URL}/connection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profileId, toUserId }),
  });

  return await res.json();
}

// export async function acceptConnection(connectionId) {
//   const res = await fetch(`${BASE_URL}/connections/${connectionId}/accept`, {
//     method: "POST",
//     headers: authHeader,
//   });
//   return res.json();
// }

//  // ❌ Reject connection
//  export async function rejectConnection(connectionId) {
//   console.log("tesdfgbhn",connectionId)
//    const res = await fetch(

//      `${BASE_URL}/connections/${connectionId}/reject`,
//      {
//        method: "POST",
//        headers: authHeader,
//      }
//    );

//    return res.json();

//  }

// // 🔹 Reject connection (USER)
// export const rejectConnection = async (connectionId) => {
//   return fetch(`${BASE_URL}/connections/${connectionId}/reject`, {
//     method: "PUT", // 👈 same as admin
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeader(), // 👈 JWT token
//     },
//     body: JSON.stringify({
//       reason: "Not interested", // optional
//     }),
//   });
// };

// //↩️ Withdraw sent request
// export async function withdrawConnection(connectionId) {
//   const res = await fetch(`${BASE_URL}/connections/${connectionId}`, {
//     method: "DELETE",
//     headers: authHeader,
//   });
//   return res.json();
// }

// My user connections
const BASE_URL_ = "http://localhost:5000/api/user";

/* =======================
   CONNECTION LIST APIs
======================= */

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");
  console.log("TOKEN FROM STORAGE:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📥 Received
export async function getReceivedConnections() {
  const res = await fetch(`${BASE_URL_}/connections/received`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

// 📤 Sent
export async function getSentConnections() {
  const res = await fetch(`${BASE_URL_}/connections/sent`, {
    headers: getAuthHeader(),
  });
  return res.json();
}

/* =======================
   CONNECTION ACTION APIs
======================= */

// ✅ Accept
export async function acceptConnection(connectionId) {
  const res = await fetch(`${BASE_URL_}/connections/${connectionId}/accept`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  return res.json();
}

// ❌ Reject
export async function rejectConnection(connectionId) {
  console.log("test fun ", rejectConnection);
  const res = await fetch(`${BASE_URL_}/connections/${connectionId}/reject`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  return res.json();
}

// ↩️ Withdraw
export async function withdrawConnection(connectionId) {
  const res = await fetch(`${BASE_URL_}/connections/${connectionId}/withdraw`, {
    method: "POST",
    headers: getAuthHeader(),
  });
  return res.json();
}


/// update Profile
export async function updateUserProfile(payload) {
  const res = await api.put("/user/profile/update", payload);
  return res.data;
}

// uploadProfilePhoto
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await api.put("/user/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
