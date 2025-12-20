import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-ayur-gradient flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-white/85 border border-emerald-50 shadow-soft-card p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Access restricted
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          This area is not available for your account type. If you&apos;re a
          doctor trying to access the practitioner dashboard, please make sure
          you registered using a valid invite code.
        </p>
        <Link
          to="/user-dashboard"
          className="text-sm text-emerald-700 font-medium hover:text-emerald-600"
        >
          Go to main app
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
