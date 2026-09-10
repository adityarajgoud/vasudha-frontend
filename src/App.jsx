import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import DomainPage from "./pages/DomainPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
          <Navbar />

          <div className="min-w-0 flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/:domainName" element={<DomainWrapper />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />
                }
              >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Protected Super Admin Routes */}
              <Route
                element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />}
              >
                <Route
                  path="/superadmin/dashboard"
                  element={<SuperAdminDashboard />}
                />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-400 sm:py-6">
            &copy; {new Date().getFullYear()} Vasudha Foundation. Full-Stack
            Data Platform Assessment.
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Helper wrapper to restrict dynamic domain route strictly to climate, energy, and power
function DomainWrapper() {
  const path = window.location.pathname.toLowerCase().replace("/", "");

  if (["climate", "energy", "power"].includes(path)) {
    return <DomainPage />;
  }

  return <Navigate to="/" replace />;
}
