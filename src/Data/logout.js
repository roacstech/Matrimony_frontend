export const performLogout = (navigate) => {
 localStorage.clear();   
  navigate("/");
};
