import { Profiler } from "react";

const BASE_URL = `${import.meta.env.VITE_APP_API_URL}`;

// 🔑 ONE key name – use this everywhere
const TOKEN_KEY = "accesstoken";

// auth header function
const getAuthHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
});

export { BASE_URL, getAuthHeader };

export async function viewProfile(viewerId, profileId) {
  const res = await fetch(`${BASE_URL}/profiles/view-profile`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({  profileId }),
  });
  return await res.json();
}
