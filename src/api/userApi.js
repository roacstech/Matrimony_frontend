import { Profiler } from "react";

const BASE_URL = "http://localhost:5000/api/user";
const token = localStorage.getItem("accesstoken");
console.log("token test", token);
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});
const authHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export async function getVisibleConnections() {
  const res = await fetch(`${BASE_URL}/connections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

export async function getUserProfile(userId) {
  const res = await fetch(`${BASE_URL}/profile/${userId}`, {
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

// export async function getReceivedConnections() {
//   const res = await fetch(
//     `${BASE_URL}/get-connection`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   return await res.json();
// }

//change by vinoth without check

/* =======================
   CONNECTION LIST APIs
======================= */

//🔹 Received connections (MyConnection – left side)
export async function getReceivedConnections() {
  const res = await fetch(`${BASE_URL}/connections/received`, {
    headers: authHeader,
  });

  console.log("tyestt", res);
  return res.json();
}

// 🔹 Sent connections (MyConnection – right side)
export async function getSentConnections() {
  const res = await fetch(`${BASE_URL}/connections/sent`, {
    headers: authHeader,
  });
  return res.json();
}

/* =======================
    CONNECTION ACTION APIs
 ======================= */

//✅ Accept connection
export async function acceptConnection(connectionId) {
  const res = await fetch(`${BASE_URL}/connections/${connectionId}/accept`, {
    method: "POST",
    headers: authHeader,
  });
  return res.json();
}

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

// 🔹 Reject connection (USER)
export const rejectConnection = async (connectionId) => {
  return fetch(`${BASE_URL}/connections/${connectionId}/reject`, {
    method: "PUT", // 👈 same as admin
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(), // 👈 JWT token
    },
    body: JSON.stringify({
      reason: "Not interested", // optional
    }),
  });
};

// ↩️ Withdraw sent request
export async function withdrawConnection(connectionId) {
  const res = await fetch(`${BASE_URL}/connections/${connectionId}`, {
    method: "DELETE",
    headers: authHeader,
  });
  return res.json();
}
