import axios from "axios";

const API_URL = `${import.meta.env.VITE_APP_API_URL}user/form/submit`;

// ✅ FIXED: sends JSON instead of multipart/form-data
// Files are already uploaded to S3 before this is called.
// payload.photoUrl and payload.horoscopeUrl are full S3 URLs like:
// https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/photos/uuid.jpg
export const submitFormAPI = async (payload, token) => {
  try {
    const res = await axios.post(
      API_URL,
      payload, // ✅ plain JS object — axios automatically sets Content-Type: application/json
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // ✅ no Content-Type override needed — axios handles it for JSON
        },
      }
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" };
  }
};