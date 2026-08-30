

import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-line mt-auto">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-full border border-line flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-brand" />
              </div>
              <span className="text-sm font-semibold tracking-[0.15em] text-ink uppercase">
                SupportFlow
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Thoughtful service requests, real people, and clear progress.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-secondary uppercase mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted hover:text-ink transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-secondary uppercase mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="mailto:hafsa.shahid.dev@gmail.com"
                aria-label="Email"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-line text-secondary hover:text-brand hover:border-brand transition-colors"
              >
                <HiOutlineMail size={16} />
              </a>

              <a
                href="https://github.com/HAFSA-SHAHID-28"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-line text-secondary hover:text-brand hover:border-brand transition-colors"
              >
                <FaGithub size={15} />
              </a>

              <a
                href="https://www.linkedin.com/in/hafsa-shahid-dev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-line text-secondary hover:text-brand hover:border-brand transition-colors"
              >
                <FaLinkedin size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {year} Verdant Noir. All rights reserved.
          </p>
          <p className="text-xs text-muted tracking-wide">
            Crafted for the MERN Final Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
