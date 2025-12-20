import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);

      // Save token + user
      localStorage.setItem("ayurToken", res.data.token);
      localStorage.setItem("ayurUser", JSON.stringify(res.data.user));

      setStatus({ type: "success", message: "Login successful. Redirecting..." });

      // later we’ll change this to role-based redirect
      const user = res.data.user;
      setTimeout(() => {
        if (user?.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      }, 800);

    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please check your details.";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />

      <Navbar />

      <main className="relative max-w-5xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid md:grid-cols-2 gap-6 items-stretch"
        >
          {/* LEFT – LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-3xl bg-white/80 backdrop-blur shadow-soft-card border border-emerald-50 p-6 md:p-8"
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
              Welcome back <span className="inline-block">🌿</span>
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              Log in to continue your AyurLifestyle journey and pick up your
              last routine where you left off.
            </p>

            {status.message && (
              <div
                className={`mb-3 text-xs rounded-xl px-3 py-2 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {status.message}
              </div>
            )}

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
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-emerald-700 hover:text-emerald-600"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                  placeholder="Enter your password"
                />
              </div>

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
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm font-medium py-2.5 shadow-soft-card transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </motion.button>
            </form>

            <p className="mt-4 text-xs text-slate-600">
              New to AyurLifestyle?{" "}
              <Link
                to="/register"
                className="text-emerald-700 font-medium hover:text-emerald-600"
              >
                Create an account
              </Link>
            </p>
          </motion.div>

          {/* RIGHT – INFO / ANIMATION PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-3xl bg-emerald-900 text-emerald-50 p-6 md:p-8 relative overflow-hidden shadow-soft-card"
          >
            {/* floating glow */}
            <motion.div
              className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-emerald-400/40 blur-3xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-lime-400/40 blur-3xl"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative space-y-4">
              <h2 className="text-xl font-semibold">
                Your wellness dashboard, in one place
              </h2>
              <p className="text-sm text-emerald-100">
                See your recommended home remedies, yoga flows and daily habits
                together. Mark what you tried, and let the assistant adapt over
                time.
              </p>

              <div className="space-y-3 text-xs">
                <AnimatedBullet>
                  Evening reminder when you skip your stretching or breathing
                  routine.
                </AnimatedBullet>
                <AnimatedBullet>
                  Suggestions automatically avoid painful joints based on your
                  last assessment.
                </AnimatedBullet>
                <AnimatedBullet>
                  Quick chat help if you&apos;re unsure how to perform an
                  asana or prepare a remedy.
                </AnimatedBullet>
              </div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-900/40 p-3 text-[11px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
                    ✔
                  </span>
                  <span className="font-semibold">
                    10 min per day is enough
                  </span>
                </div>
                <p className="text-emerald-100">
                  The goal is not perfection. It&apos;s building 2–3 consistent
                  habits around sleep, digestion and movement.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

const AnimatedBullet = ({ children }) => (
  <motion.div
    className="flex items-start gap-2"
    whileHover={{ x: 4 }}
    transition={{ type: "spring", stiffness: 200, damping: 18 }}
  >
    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-300" />
    <p>{children}</p>
  </motion.div>
);

export default LoginPage;
