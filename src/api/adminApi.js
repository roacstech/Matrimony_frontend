const BASE_URL = "http://localhost:5000/api/admin";

// token helper
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// 🔹 Get pending users
export const getPendingForms = async () => {
  const res = await fetch(`${BASE_URL}/forms/pending`, {
    headers: getAuthHeader(),
  });
  const data = await res.json();

  // backend structure ku adjust
  return data?.data?.data || [];
};

// 🔹 Reject user
export const rejectUser = async (id) => {
  return fetch(`${BASE_URL}/reject/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ reason: "Profile incomplete" }),
  });
};

// 🔹 Approve user (backend ready illa naalum)
export const approveUser = async (id) => {
  return fetch(`${BASE_URL}/approve/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
  });
};



/* ================================
   GET ALL USERS (AllUsers table)
================================ */
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch users");
  }

  return data.data; // 👈 direct array
};

/* ================================
   GET PENDING USERS (Admin approve list)
================================ */
export const getPendingUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/pending`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch pending users");
  }

  return data.data;
};

/* ================================
   ADMIN APPROVE USER
================================ */
export const adminApproveUser = async (profileId) => {
  const res = await fetch(
    `${BASE_URL}/users/${profileId}/approve`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Approve failed");
  }

  return data;
};

/* ================================
   ADMIN REJECT USER
================================ */
export const adminRejectUser = async (profileId) => {
  const res = await fetch(
    `${BASE_URL}/users/${profileId}/reject`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Reject failed");
  }

  return data;
};

/* ================================
   TOGGLE PUBLIC / PRIVATE
================================ */
export const toggleUserVisibility = async (profileId) => {
  const res = await fetch(
    `${BASE_URL}/users/${profileId}/visibility`,
    {
      method: "PUT",
      headers: {
        ...getAuthHeader(),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Visibility update failed");
  }

  return data; // { success, isPublic }
};

// ================= DASHBOARD STATS =================
export const getAdminDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch dashboard data");
  }

  return data.data; 
  // {
  //   totalUsers,
  //   activeUsers,
  //   inactiveUsers,
  //   maleUsers,
  //   femaleUsers
  // }
};
