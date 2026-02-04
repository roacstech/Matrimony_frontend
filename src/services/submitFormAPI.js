import axios from "axios";

const API_URL = "http://localhost:5000/api/user/form/submit";

export const submitFormAPI = async (formData, token) => {
  try {
    const fd = new FormData();

    // append all fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        fd.append(key, formData[key]);
      }
    });

    // extra flags (backend expects)
    if (formData.horoscope) {
      fd.append("horoscopeUploaded", true);
      fd.append("horoscopeFileName", formData.horoscope.name);
    }

    const res = await axios.post(API_URL, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ don't set Content-Type
      },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" };
  }
};
