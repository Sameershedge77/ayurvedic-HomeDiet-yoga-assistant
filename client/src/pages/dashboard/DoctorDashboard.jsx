import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { getUser, logout } from "../../hooks/useAuth";

const DoctorDashboard = () => {
  const user = getUser();

  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
      <Navbar />

      <main className="relative max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Doctor dashboard 🩺
            </h1>
            <p className="text-sm text-slate-600">
              Welcome {user?.name || ""}. Here you&apos;ll see complex cases,
              appointment requests and knowledgebase updates.
            </p>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          >
            Log out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 border border-emerald-50 p-4 shadow-soft-card"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              New user questions
            </h2>
            <p className="text-xs text-slate-600">
              Future: list of user queries that the system couldn&apos;t answer
              confidently, waiting for your input.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 border border-emerald-50 p-4 shadow-soft-card"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Appointment requests
            </h2>
            <p className="text-xs text-slate-600">
              Future: users can request online consultation slots that appear
              here for you to accept or reschedule.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white/80 border border-emerald-50 p-4 shadow-soft-card"
          >
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Knowledgebase suggestions
            </h2>
            <p className="text-xs text-slate-600">
              Future: review new remedies / yoga flows suggested by the AI
              before they are added to the main dataset.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
