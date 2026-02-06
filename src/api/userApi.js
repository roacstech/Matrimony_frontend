const BASE_URL = "http://localhost:5000/api/user";
const token = localStorage.getItem("accesstoken");
console.log("token test",token)

export async function getVisibleConnections() {
  const res = await fetch(`${BASE_URL}/connections`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

export async function getUserProfile(userId) {
  const res = await fetch(
    `${BASE_URL}/profile/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return await res.json();
}

export async function sendConnectionRequest(toUserId) {
  const res = await fetch(
    `${BASE_URL}/sendconnection`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ toUserId })
    }
  );

  return await res.json();
}

export async function getReceivedConnections() {
  const res = await fetch(
    `${BASE_URL}/get-connection`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return await res.json();
}

//// change by vinoth without check

/* =======================
   CONNECTION LIST APIs
======================= */

// // 🔹 Received connections (MyConnection – left side)
// export async function getReceivedConnections() {
//   const res = await fetch(`${BASE_URL}/connections/received`, {
//     headers: authHeader,
//   });
//   return res.json();
// }

// // 🔹 Sent connections (MyConnection – right side)
// export async function getSentConnections() {
//   const res = await fetch(`${BASE_URL}/connections/sent`, {
//     headers: authHeader,
//   });
//   return res.json();
// }

// /* =======================
//    CONNECTION ACTION APIs
// ======================= */

// // ✅ Accept connection
// export async function acceptConnection(connectionId) {
//   const res = await fetch(
//     `${BASE_URL}/connections/${connectionId}/accept`,
//     {
//       method: "POST",
//       headers: authHeader,
//     }
//   );
//   return res.json();
// }

// // ❌ Reject connection
// export async function rejectConnection(connectionId) {
//   const res = await fetch(
//     `${BASE_URL}/connections/${connectionId}/reject`,
//     {
//       method: "POST",
//       headers: authHeader,
//     }
//   );
//   return res.json();
// }

// // ↩️ Withdraw sent request
// export async function withdrawConnection(connectionId) {
//   const res = await fetch(
//     `${BASE_URL}/connections/${connectionId}`,
//     {
//       method: "DELETE",
//       headers: authHeader,
//     }
//   );
//   return res.json();

