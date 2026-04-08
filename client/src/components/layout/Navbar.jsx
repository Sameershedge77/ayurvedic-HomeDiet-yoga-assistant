// 🔥 FINAL NAVBAR — full animations, working dropdown, fixed spacing, proper z-index
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, History, LayoutDashboard, ClipboardCheck, Sparkles, Calendar } from "lucide-react";

export default function Navbar() {
  const user = getUser();
  const location = useLocation();

  // Logic: Show PublicNavbar on Landing Page ('/'). 
  // Show AppNavbar on all other pages if user is logged in.
  const isLandingPage = location.pathname === "/";

  if (isLandingPage) {
    return <PublicNavbar user={user} />;
  }

  return user ? <AppNavbar user={user} /> : <PublicNavbar user={user} />;
}

/* -------------------------------------------------------------------------- */
/*                                 PUBLIC NAV                                 */
/* -------------------------------------------------------------------------- */

function PublicNavbar({ user }) {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          <NavItem label="Why AyurHealth?" anchor="#why" />
          <NavItem label="How it works" anchor="#how-it-works" />
          <NavItem label="Features" anchor="#features" />
          <NavItem label="Safety" anchor="#safety" />
        </div>

        {/* AUTH/DASHBOARD BUTTONS */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/user-dashboard"
                className="px-6 py-2 text-sm font-bold rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition"
              >
                Get Started
              </Link>
            </>
          )}
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
  const location = useLocation();
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
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Logo to="/user-dashboard" />

        {/* CENTER NAV - HISTORY REMOVED AS REQUESTED */}
        <div className="hidden md:flex items-center gap-6">
          <ActiveNavLink label="Dashboard" path="/user-dashboard" icon={<LayoutDashboard size={16} />} />
          <ActiveNavLink label="Assessment" path="/assessment" icon={<ClipboardCheck size={16} />} />
          <ActiveNavLink label="Appointments" path="/appointments" icon={<Calendar size={16} />} />
          <ActiveNavLink label="Wellness Lab" path="/wellness-lab" icon={<Sparkles size={16} />} />
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={ddRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100/50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 transition cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shadow-md">
              {getInitials(user?.name)}
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 hidden sm:block">
              {user?.name?.split(' ')[0]}
            </span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2 z-[10000] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                </div>

                <div className="p-1">
                  <DropdownItem
                    icon={<Settings size={16} />}
                    label="Settings"
                    onClick={() => navigate("/settings")}
                  />
                  <DropdownItem
                    icon={<History size={16} />}
                    label="My History"
                    onClick={() => navigate("/recommendation-history")}
                  />
                  <hr className="my-1 border-slate-50" />
                  <DropdownItem
                    icon={<LogOut size={16} />}
                    label="Logout"
                    onClick={logout}
                    variant="danger"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
    <Link to={to} className="flex items-center gap-3 select-none group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="h-12 w-12 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-50"
      >
        <img src="/images/logos/mj1.png" alt="Logo" className="w-full h-full object-cover" />
      </motion.div>

      <div className="hidden sm:block">
        <div className="text-lg font-black text-emerald-800 leading-none">
          Ayur<span className="text-slate-900">Health</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Personal Wellness Assistant
        </div>
      </div>
    </Link>
  );
}

function NavItem({ label, anchor }) {
  return (
    <a
      href={anchor}
      className="relative text-sm font-bold text-slate-600 hover:text-emerald-700 transition group"
    >
      {label}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

function ActiveNavLink({ label, path, icon, onClick }) {
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <button
      onClick={onClick ?? (() => (window.location.href = path))}
      className={`relative flex items-center gap-2 px-3 py-2 text-sm font-bold transition-all rounded-lg ${active
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
        }`}
    >
      {icon}
      {label}
      {active && (
        <motion.div
          layoutId="active-nav-dot"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"
        />
      )}
    </button>
  );
}

function DropdownItem({ icon, label, onClick, variant = "default" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${variant === "danger"
        ? "text-red-600 hover:bg-red-50"
        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase();
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
}
