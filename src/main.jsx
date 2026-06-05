import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import router from "./Route/Router.jsx";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./color/ThemeProvider.jsx";
import AuthProvider from "./Firebase/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <StrictMode>
        <Toaster position="top-right" reverseOrder={false} />
        <ToastContainer position="top-right" autoClose={3000} />
        <RouterProvider router={router} />
      </StrictMode>
    </ThemeProvider>
  </AuthProvider>,
);
