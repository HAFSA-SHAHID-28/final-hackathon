import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  HiMenu,
  HiX,
} from "react-icons/hi";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const goDashboard = () => {
    setIsOpen(false);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const isDashboard =
    location.pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-card">
      <nav className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() =>
              setIsOpen(false)
            }
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-line">
              <div className="h-2 w-2 rounded-full bg-brand" />
            </div>

            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-ink">
              SupportFlow
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">
                    {user.name}
                  </p>

                  <p className="text-xs capitalize text-muted">
                    {user.role}
                  </p>
                </div>

                {!isDashboard && (
                  <button
                    type="button"
                    onClick={goDashboard}
                    className="px-3 py-2 text-sm font-medium text-secondary transition hover:text-ink"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-card transition hover:bg-brand-dark"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-card transition hover:bg-brand-dark"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile */}
          <button
            type="button"
            onClick={() =>
              setIsOpen((value) => !value)
            }
            className="text-ink md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <HiX size={24} />
            ) : (
              <HiMenu size={24} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-line bg-card px-5 py-4 md:hidden">
          {user ? (
            <div className="space-y-2">
              <div className="rounded-md bg-page p-3">
                <p className="text-sm font-semibold">
                  {user.name}
                </p>

                <p className="mt-1 text-xs capitalize text-muted">
                  {user.role}
                </p>
              </div>

              {!isDashboard && (
                <button
                  type="button"
                  onClick={goDashboard}
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm text-secondary hover:bg-page hover:text-ink"
                >
                  Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-md bg-brand px-3 py-2.5 text-sm font-medium text-card"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() =>
                setIsOpen(false)
              }
              className="block rounded-md bg-brand px-3 py-2.5 text-center text-sm font-medium text-card"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;