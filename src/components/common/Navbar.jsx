import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Flame,
  Zap,
  Wind,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight block leading-tight">
                VASUDHA
              </span>
              <span className="text-xs font-semibold text-emerald-600 tracking-wider block leading-none uppercase">
                Data Platform
              </span>
            </div>
          </Link>

          {/* Public Domain Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Data
            </Link>
            <Link
              to="/climate"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/climate")
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wind className="w-4 h-4 text-sky-500" /> Climate
            </Link>
            <Link
              to="/energy"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/energy")
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" /> Energy
            </Link>
            <Link
              to="/power"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive("/power")
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-4 h-4 text-yellow-500" /> Power
            </Link>
          </nav>

          {/* Auth CTA & Dashboard Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === "SUPER_ADMIN" ? (
                  <Link
                    to="/superadmin/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition"
                  >
                    <ShieldCheck className="w-4 h-4" /> Super Admin Portal
                  </Link>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Portal
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm transition"
              >
                <LogIn className="w-4 h-4" /> Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
