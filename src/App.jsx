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
        <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
          <Navbar />
          <div className="flex-1">
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

          <footer className="py-6 text-xs text-center bg-white border-t border-slate-200 text-slate-400">
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
