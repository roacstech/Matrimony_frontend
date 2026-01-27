import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import MatrimonyForm from "../form/MatrimonyForm";

const LoginRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />

      {/* AFTER LOGIN */}
      <Route path="/form" element={<MatrimonyForm />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default LoginRoutes;
