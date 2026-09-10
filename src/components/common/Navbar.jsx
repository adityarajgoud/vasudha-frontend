import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "All data", path: "/" },
    { label: "Climate", path: "/climate" },
    { label: "Energy", path: "/energy" },
    { label: "Power", path: "/power" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white">
            <Globe className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="leading-none">
            <div className="text-[17px] font-semibold tracking-tight text-slate-900">
              Vasudha
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              Data platform
            </div>
          </div>
        </Link>

        {/* Main navigation */}
        <nav className="hidden md:flex items-center ml-10 mr-auto h-full">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex h-full items-center px-4 text-sm transition-colors
                  ${
                    active
                      ? "font-medium text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                {item.label}

                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-emerald-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === "SUPER_ADMIN" ? (
                <Link
                  to="/superadmin/dashboard"
                  className="hidden sm:flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}

              <div className="h-5 w-px bg-slate-200" />

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" />
              Admin login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
