// frontend/src/components/Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    setIsOpen(false);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-line">
      <nav className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full border border-line flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-brand" />
            </div>
            <span className="text-sm font-semibold tracking-[0.15em] text-ink uppercase">
              Verdant Noir
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-secondary hover:text-ink transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop auth area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted">{user.name}</span>
                <button
                  onClick={handleAuthClick}
                  className="text-sm text-secondary hover:text-ink transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-card bg-brand rounded-md hover:bg-brand-dark transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="px-4 py-2 text-sm font-medium text-card bg-brand rounded-md hover:bg-brand-dark transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ink"
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-line bg-card px-5 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block py-2.5 text-sm text-secondary hover:text-ink transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-line">
            {user ? (
              <>
                <p className="py-2 text-sm text-muted">{user.name}</p>
                <button
                  onClick={handleAuthClick}
                  className="block w-full text-left py-2.5 text-sm text-secondary hover:text-ink transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full py-2.5 text-sm font-medium text-card bg-brand rounded-md hover:bg-brand-dark transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthClick}
                className="w-full py-2.5 text-sm font-medium text-card bg-brand rounded-md hover:bg-brand-dark transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;