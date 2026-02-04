import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginRoutes from "./routes/LoginRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

function App() 
{
  
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN / PUBLIC ROUTES */}

        
        <Route path="/" element={<LoginRoutes />} />

    {/* ADMIN ROUTES */}
                 <Route path="/admin/*" element={<AdminRoutes/>} />

        {/* USER ROUTES */}
        <Route path="/user/*" element={<UserRoutes />} />

     

      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
