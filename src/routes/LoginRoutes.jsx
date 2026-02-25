import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import MatrimonyForm from "../form/MatrimonyForm";
import Forgetpassword from "../pages/Forgetpassword";

const LoginRoutes = () => {
  console.log("✅ LoginRoutes mounted");
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/form" element={<MatrimonyForm />} />
      <Route path="/forget" element={<Forgetpassword />} />


      {/* fallback only for LOGIN scope */}
       <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default LoginRoutes;
