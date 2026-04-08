import { Link } from "react-router-dom";
import { getUser } from "../hooks/useAuth";

const Unauthorized = () => {
  const user = getUser();

  // Dynamic link based on role to prevent redirection loops
  const mainLink = user?.role === "doctor" ? "/doctor-dashboard" : "/user-dashboard";
  const linkLabel = user?.role === "doctor" ? "Go to Doctor Dashboard" : "Go to main app";

  return (
    <div className="min-h-screen bg-ayur-gradient flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-white/85 border border-emerald-50 shadow-soft-card p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Access Restricted
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          This area is not available for your account type. If you're a
          doctor trying to access the practitioner dashboard, please make sure
          you registered using a valid invite code.
        </p>
        <Link
          to={mainLink}
          className="inline-block w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
