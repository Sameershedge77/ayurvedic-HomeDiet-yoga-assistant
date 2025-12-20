import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import api from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",     // user type for UX
    inviteCode: "",      // only for doctors
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Map UI role to backend role: only "Doctor" selection becomes doctor
    const backendRole =
      form.role === "Doctor" || form.role === "doctor" ? "doctor" : "user";

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: backendRole,
        inviteCode: backendRole === "doctor" ? form.inviteCode : null,
      });

      setStatus({
        type: "success",
        message: "Account created successfully. Redirecting to login...",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
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
          {/* LEFT – INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-3xl bg-emerald-900 text-emerald-50 p-6 md:p-8 relative overflow-hidden shadow-soft-card"
          >
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
              <h1 className="text-2xl md:text-3xl font-semibold mb-1">
                Create your free account
              </h1>
              <p className="text-sm text-emerald-100">
                You&apos;ll start with a simple lifestyle assessment. Based on
                your answers, the assistant prepares remedies, diet tips and
                yoga flows tailored to you.
              </p>

              <div className="space-y-3 text-xs mt-3">
                <Tag>Students with long screen hours</Tag>
                <Tag>Working professionals with stress & neck pain</Tag>
                <Tag>Doctors who want to guide users online</Tag>
              </div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-5 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 p-3 text-[11px]"
              >
                <p className="font-semibold mb-1">
                  For doctors & practitioners
                </p>
                <p className="text-emerald-100">
                  If you are a qualified Ayurvedic doctor, you can use a special
                  invite code to create a doctor account and answer complex
                  cases from users.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT – REGISTER FORM */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-3xl bg-white/80 backdrop-blur shadow-soft-card border border-emerald-50 p-6 md:p-8"
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Let&apos;s set things up ✨
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              This basic profile helps the assistant personalise your suggestions
              from day one.
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
                  htmlFor="name"
                  className="text-xs font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                  placeholder="e.g. Samer Shedge"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                  placeholder="Create a strong password"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="role"
                  className="text-xs font-medium text-slate-700"
                >
                  I&apos;m mainly using this as a
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                >
                  <option value="Student">Student</option>
                  <option value="Working">Working professional</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Doctor">Doctor / Practitioner</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Invite code only when Doctor selected */}
              {form.role === "Doctor" && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Doctor invite code
                  </label>
                  <input
                    type="text"
                    name="inviteCode"
                    value={form.inviteCode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-emerald-100 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                    placeholder="Enter doctor access code"
                    required
                  />
                </div>
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
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm font-medium py-2.5 shadow-soft-card transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </motion.button>
            </form>

            <p className="mt-4 text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-700 font-medium hover:text-emerald-600"
              >
                Log in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

const Tag = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.03, x: 2 }}
    className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-500/50 text-[11px]"
  >
    {children}
  </motion.div>
);

export default RegisterPage;
