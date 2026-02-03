

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, 
  // http://localhost:5000/api/
});
console.log("AXIOS BASE URL 👉", import.meta.env.VITE_APP_API_URL);


axiosInstance.interceptors.request.use(
  (config) => {
    const accesstoken = localStorage.getItem("accesstoken");
    const roleid = localStorage.getItem("roleid");
    // const userid = localStorage.getItem("userid");

    if (accesstoken) config.headers["auth"] = accesstoken;
    if (roleid) config.headers["roleid"] = Number(roleid);
    // if (userid) config.headers["userid"] = Number(userid);

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
