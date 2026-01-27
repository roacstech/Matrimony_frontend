import React from 'react';
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom';
import LoginRoutes from './routes/LoginRoutes'; // Adjust path if needed

function App() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
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