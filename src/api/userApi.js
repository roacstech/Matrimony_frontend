import { Profiler } from "react";

const BASE_URL = "http://localhost:5000/api/user";

// 🔑 ONE key name – use this everywhere
const TOKEN_KEY = "accesstoken";

// auth header function
const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
});

export { BASE_URL, getAuthHeader };

export async function getVisibleConnections() {
  const token = localStorage.getItem("accesstoken");

  const res = await fetch(`${BASE_URL}/connections/visible`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return await res.json();
}

export async function getUserProfile(userId) {
  const token = localStorage.getItem("accesstoken");

  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function sendConnectionRequest(profileId) {
  const res = await fetch(`${BASE_URL}/connections/request`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileId }),
  });

  return res.json();
}

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
  const res = await fetch(`${BASE_URL}/connections/received`, {
    method: "GET",
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
//acpect connection
export async function acceptConnection(connectionId) {
  const res = await fetch(`${BASE_URL}/connections/${connectionId}/accept`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

//acpect connection get
export async function getAcceptedConnections() {
  const res = await fetch(`${BASE_URL_}/connections/accepted`, {
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
    method: "DELETE",
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

//uploadHoroscope

export const uploadHoroscope = async (file) => {
  const formData = new FormData();
  formData.append("horoscope", file); // ⚠️ must match backend

  const res = await api.put("/user/profile/horoscope", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
