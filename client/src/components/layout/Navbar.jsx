// 🔥 FINAL NAVBAR — full animations, working dropdown, fixed spacing, proper z-index
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const PUBLIC_PAGES = ["/", "/login", "/register", "/forgot-password"];

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublic =
    PUBLIC_PAGES.some((p) => location.pathname.startsWith(p)) && !user;

  return isPublic ? <PublicNavbar /> : <AppNavbar user={user} />;
}

/* -------------------------------------------------------------------------- */
/*                                 PUBLIC NAV                                 */
/* -------------------------------------------------------------------------- */

function PublicNavbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Logo />

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <NavItem label="Why this app?" anchor="#why" />
          <NavItem label="How it works" anchor="#how-it-works" />
          <NavItem label="What you get" anchor="#features" />
          <NavItem label="Safety" anchor="#safety" />
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white shadow-md hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                                APP NAVBAR                                  */
/* -------------------------------------------------------------------------- */

function AppNavbar({ user }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ddRef = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <nav className="w-full fixed top-0 left-0 z-[999] bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Logo to="/user-dashboard" />

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-8">
          <ActiveNavLink label="Home" path="/user-dashboard" />
          <ActiveNavLink label="Assessment" path="/assessment" />
          <ActiveNavLink
            label="Appointments"
            path="/user-dashboard#appointments"
            onClick={() => navigate("/user-dashboard#appointments")}
          />
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={ddRef}>
          <button
            onClick={() => setOpen(!open)}
            className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center hover:bg-emerald-200 transition cursor-pointer"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          >
            {getInitials(user?.name)}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-slate-200 py-1 z-[10000]">
              <button
                onClick={() => {
                  navigate("/settings");
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
              >
                Settings
              </button>

              <button
                onClick={() => {
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-3 select-none">
      <motion.div
        whileHover={{ scale: 1.12, rotate: 3 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 text-white flex items-center justify-center text-lg font-bold shadow-md"
      >
        AY
      </motion.div>

      <div>
        <div className="text-sm font-semibold text-emerald-700">
          Ayur <span className="text-slate-900">Lifestyle</span>
        </div>
        <div className="text-xs text-slate-500 -mt-0.5">
          Home remedies · Diet · Yoga assistant
        </div>
      </div>
    </Link>
  );
}

function NavItem({ label, anchor }) {
  return (
    <a
      href={anchor}
      className="relative text-sm text-slate-600 hover:text-emerald-700 transition group"
    >
      {label}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

function ActiveNavLink({ label, path, onClick }) {
  const active = window.location.pathname === path;

  return (
    <button
      onClick={onClick ?? (() => (window.location.href = path))}
      className={`relative text-sm ${
        active ? "text-emerald-700 font-semibold" : "text-slate-600"
      } hover:text-emerald-700 transition group`}
    >
      {label}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-emerald-600 transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </button>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
