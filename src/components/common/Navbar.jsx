import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Globe,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "All data", path: "/" },
    { label: "Climate", path: "/climate" },
    { label: "Energy", path: "/energy" },
    { label: "Power", path: "/power" },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          onClick={closeMobileMenu}
        >
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

        {/* Main navigation - Desktop */}
        <nav className="ml-10 mr-auto hidden h-full items-center md:flex">
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

        {/* Right side - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.role === "SUPER_ADMIN" ? (
                <Link
                  to="/superadmin/dashboard"
                  className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex"
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`block rounded-md px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-slate-50 font-medium text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {user ? (
              <div className="mt-3 border-t border-slate-200 pt-3">
                {user.role === "SUPER_ADMIN" ? (
                  <Link
                    to="/superadmin/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-3 border-t border-slate-200 pt-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <LogIn className="h-4 w-4" />
                  Admin login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
