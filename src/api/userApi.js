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
