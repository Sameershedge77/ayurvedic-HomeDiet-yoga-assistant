import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email.trim()) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading(true);

    try {
      // TODO: later connect to backend:
      // await axios.post("/api/auth/forgot-password", { email });
    //   
        const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus({ type: "", message: "" });

  if (!email.trim()) {
    setStatus({ type: "error", message: "Please enter your email address." });
    return;
  }

  setLoading(true);

  try {
    const res = await api.post("/auth/forgot-password", { email });
    setStatus({
      type: "success",
      message:
        res.data?.message ||
        "If this email is registered, a password reset link will be sent shortly.",
    });
  } catch (err) {
    setStatus({
      type: "error",
      message: "Something went wrong. Please try again after some time.",
    });
  } finally {
    setLoading(false);
  }
};


      setStatus({
        type: "success",
        message:
          "If this email is registered, a password reset link will be sent shortly.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again after some time.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />

      <Navbar />

      <main className="relative max-w-xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl bg-white/85 backdrop-blur shadow-soft-card border border-emerald-50 p-6 md:p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2"
          >
            Forgot your password?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-sm text-slate-600 mb-6"
          >
            Enter the email address you used to create your AyurLifestyle
            account. We&apos;ll send you a secure link to reset your password.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                placeholder="you@example.com"
              />
            </div>

            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs rounded-xl px-3 py-2 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {status.message}
              </motion.div>
            )}

            <motion.button
              whileHover={
                !loading
                  ? {
                      scale: 1.03,
                      boxShadow: "0 18px 35px rgba(16,185,129,0.4)",
                    }
                  : {}
              }
              whileTap={!loading ? { scale: 0.97 } : {}}
              disabled={loading}
              type="submit"
              className="w-full mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm font-medium py-2.5 shadow-soft-card transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send reset link"}
            </motion.button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs text-slate-600">
            <Link
              to="/login"
              className="text-emerald-700 font-medium hover:text-emerald-600"
            >
              ← Back to login
            </Link>
            <Link
              to="/register"
              className="hover:text-emerald-700"
            >
              Need an account? Sign up
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
