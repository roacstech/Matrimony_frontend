const BASE_URL = "http://localhost:5000/api/admin";

/* ===============================
   AUTH HEADER
================================ */
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

/* ===============================
   GET PENDING FORMS
================================ */
// ../../api/adminApi.js
export const getPendingForms = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/forms/pending");
    const data = await res.json();
    return data.data.data; // ✅ this is the array of pending users
  } catch (err) {
    console.error(err);
    return [];
  }
};



/* ===============================
   REJECT USER
================================ */
export const rejectUser = async (id) => {
  const res = await fetch(`${BASE_URL}/reject/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ reason: "Profile incomplete" }),
  });

  return res.json();
};

/* ===============================
   APPROVE USER
================================ */
export const approveUser = async (id) => {
  const res = await fetch(`${BASE_URL}/approve/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
  });

  return res.json();
};

/* ===============================
   GET ALL USERS (AllUsers.jsx)
================================ */
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch users");
  }

  return data.data; // 👈 array of users
};

/* ===============================
   GET PENDING USERS
================================ */
export const getPendingUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/pending`, {
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch pending users");
  }

  return data.data;
};

/* ===============================
   ADMIN APPROVE USER
================================ */
export const adminApproveUser = async (profileId) => {
  const res = await fetch(`${BASE_URL}/users/${profileId}/approve`, {
    method: "PUT",
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Approve failed");
  }

  return data;
};

/* ===============================
   ADMIN REJECT USER
================================ */
export const adminRejectUser = async (profileId) => {
  const res = await fetch(`${BASE_URL}/users/${profileId}/reject`, {
    method: "PUT",
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Reject failed");
  }

  return data;
};

/* ===============================
   TOGGLE USER VISIBILITY (IMPORTANT)
================================ */
export const adminToggleVisibility = async ({ id, key }) => {
  const res = await fetch(`${BASE_URL}/users/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ id, key }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Visibility update failed");
  }

  return data; // { success, is_active }
};

/* ===============================
   ADMIN DASHBOARD STATS
================================ */
export const getAdminDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: getAuthHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch dashboard");
  }

  return data.data;
};



