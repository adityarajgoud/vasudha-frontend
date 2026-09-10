import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DomainPage from "./pages/DomainPage";
import AdminDashboard from "./pages/AdminDashboard";
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
        <div className="flex-1">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="py-6 text-xs text-center bg-white border-t border-slate-200 text-slate-400">
          &copy; {new Date().getFullYear()} Vasudha Foundation. Full-Stack Data
          Platform Assessment.
        </footer>
      </div>
    </BrowserRouter>
  );
}
