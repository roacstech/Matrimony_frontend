import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginRoutes from "./routes/LoginRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* LOGIN / PUBLIC ROUTES */}

        <Route path="/*" element={<LoginRoutes />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* USER ROUTES */}
        <Route path="/user/*" element={<UserRoutes />} />
      </Routes>

      <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
        toastOptions={{
          duration: 1500,
          style: {
            borderRadius: "12px",
            fontWeight: "600",
          },
        }}
      />
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
