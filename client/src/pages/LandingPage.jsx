import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login"); // later: navigate("/assessment") after auth
  };

  return (
    <div className="min-h-screen bg-ayur-gradient relative overflow-hidden">
      {/* subtle glow */}
      <div className="hero-glow pointer-events-none absolute inset-0 opacity-60" />

      <Navbar />

      {/* HERO SECTION */}
      <main className="relative max-w-6xl mx-auto px-4 pt-28 pb-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* LEFT: Text */}
        <section className="flex-1 space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-emerald-100 shadow-sm text-xs text-emerald-700"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Personal wellness coach built with Ayurveda, home diet & yoga
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
          >
            Turn{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-lime-500 bg-clip-text text-transparent">
              daily habits
            </span>{" "}
            into better sleep, digestion and joint comfort.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-sm md:text-base text-slate-600 max-w-xl"
          >
            AyurLifestyle asks about your routine, work style and common issues
            like acidity, cold, back or ankle pain. Then it suggests safe
            home remedies, diet tweaks and yoga flows that avoid stressing your
            weak spots.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16,185,129,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 text-white text-sm md:text-base font-medium shadow-soft-card transition transform flex items-center gap-2"
            >
              Start free assessment
              <span className="text-lg">→</span>
            </motion.button>

            <motion.a
              href="#how-it-works"
              whileHover={{ x: 3 }}
              className="text-sm md:text-base text-emerald-800 hover:text-emerald-600 flex items-center gap-1"
            >
              Watch the flow
              <span className="text-lg">⤵</span>
            </motion.a>
          </motion.div>

          {/* 3 feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4"
          >
            <FeaturePill
              title="For real life routines"
              description="Designed for students & working people with irregular sleep and screen-heavy days."
            />
            <FeaturePill
              title="Joint-aware yoga"
              description="Engine avoids suggesting poses that load painful ankles, knees or spine."
            />
            <FeaturePill
              title="Explainable AI"
              description="Rule + ML based engine you can present clearly in your major project viva."
            />
          </motion.div>
        </section>

        {/* RIGHT: Animated snapshot */}
        <section className="flex-1 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="relative max-w-md mx-auto"
          >
            <div className="rounded-3xl bg-white/85 backdrop-blur shadow-soft-card border border-emerald-50 p-5 md:p-6 hover:shadow-xl transition-shadow">
              {/* Top summary */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
                    Example user
                  </div>
                  <div className="text-sm text-slate-600">
                    21 yrs • IT student • Late-night coding
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-100">
                  Goal: Less acidity & neck pain
                </div>
              </div>

              {/* Recommendation cards */}
              <div className="space-y-3">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-2xl bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-100 p-3 flex items-start gap-3 hover:-translate-y-1 hover:shadow-md transition"
                >
                  <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-2xl">
                    🌿
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-800">
                      Post-dinner home remedy
                    </div>
                    <p className="text-xs text-slate-600">
                      Light cumin–fennel drink 30 mins after dinner, 3× a week
                      to ease acidity without heavy medicines.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  }}
                  className="rounded-2xl bg-white border border-emerald-100 p-3 flex items-start gap-3 hover:-translate-y-1 hover:shadow-md transition"
                >
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
                    🧘
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-800">
                      Safe neck & back sequence
                    </div>
                    <p className="text-xs text-slate-600">
                      12-min routine with gentle supine stretches. Standing
                      balance poses are removed because of neck pain.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.6, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="rounded-2xl bg-slate-900 text-emerald-50 p-3 flex items-start gap-3 hover:shadow-lg transition"
                >
                  <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-lg">
                    🤖
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-50">
                      Chatbot guidance
                    </div>
                    <p className="text-xs text-emerald-100">
                      “Today your ankle is sore, so I’ll skip all high
                      weight-bearing poses and keep you on the mat.”
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Wellness stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <StatChip label="+20%" sub="Less bloating in 3 weeks" color="emerald" />
                <StatChip label="10 min" sub="Average daily routine" color="lime" />
                <StatChip label="Safe" sub="Joint-aware suggestions" color="amber" />
              </div>
            </div>

            {/* Glowy blobs */}
            <motion.div
              className="absolute -top-6 -right-4 h-16 w-16 rounded-full bg-emerald-200/70 blur-xl"
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-8 -left-6 h-20 w-20 rounded-full bg-lime-200/70 blur-xl"
              animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </section>
      </main>

      {/* PROBLEM SECTION */}
      <section
        id="problem"
        className="max-w-6xl mx-auto px-4 pb-10 md:pb-14"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
          Why this platform exists
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-3xl">
          Most of us know basic home tips like “drink kadha” or “do yoga”, but
          we don&apos;t know which remedy is right for our body type, schedule
          or current pain. Random internet advice can even suggest poses that
          make an injury worse. AyurLifestyle gives you structured, personalised
          suggestions instead of generic lists.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-4 pb-10 md:pb-14"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
          How AyurLifestyle works
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
          <StepCard
            step="1"
            title="Tell us about your lifestyle"
            body="Fill a quick assessment with dropdowns only: sleep pattern, work type, food habits, region, and your main issues like acidity, cold or joint pain."
          />
          <StepCard
            step="2"
            title="Engine maps you to remedies"
            body="Our rule + AI model links your profile to curated Ayurvedic remedies, diet tips and yoga asanas, then filters out anything risky for your joints."
          />
          <StepCard
            step="3"
            title="Follow a simple daily plan"
            body="View everything in one dashboard: morning, day and night suggestions, plus a chatbot to clarify how to prepare or perform each step."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 pb-10 md:pb-14"
>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
          What you get inside the app
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-600">
        <FeatureCard title="Smart recommendations">
            Personalised home remedies, diet tweaks and yoga flows based on your
            lifestyle and region, instead of one-size-fits-all tips.
        </FeatureCard>

        <FeatureCard title="Talk to real Ayurvedic experts">
         When your issue feels more serious, you can move beyond self-care:
        the platform can help you find and request an online appointment
        with a qualified doctor or Ayurvedic practitioner for detailed
        guidance.
        </FeatureCard>

        <FeatureCard title="Explainable safety layer">
          Every suggestion passes through a safety engine that checks pain
          location, severity and pose properties to avoid poses that load
          painful ankles, knees or spine.
        </FeatureCard>
      </div>
      </section>
  

      {/* SAFETY */}
      <section id="safety" className="max-w-6xl mx-auto px-4 pb-14">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
          Safety & disclaimer
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-3xl">
          AyurLifestyle is a learning and wellness-support tool. It does not
          diagnose or treat medical conditions and should not replace a doctor
          or qualified Ayurvedic practitioner. If you have severe pain, chronic
          illness, recent surgery or feel unsure, always consult a professional
          before trying any suggestion.
        </p>
      </section>
    </div>
  );
};

const FeaturePill = ({ title, description }) => (
  <div className="rounded-2xl bg-white/80 border border-emerald-50 px-3 py-3 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
    <div className="text-xs font-semibold text-emerald-800 mb-1">{title}</div>
    <p className="text-[11px] text-slate-600">{description}</p>
  </div>
);

const StatChip = ({ label, sub, color }) => {
  const bgMap = {
    emerald: "bg-emerald-50 text-emerald-800",
    lime: "bg-lime-50 text-emerald-800",
    amber: "bg-amber-50 text-amber-800",
  };
  return (
    <div className={`p-2 rounded-xl ${bgMap[color] || ""}`}>
      <div className="font-semibold">{label}</div>
      <div className="text-[11px]">{sub}</div>
    </div>
  );
};

const StepCard = ({ step, title, body }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 18px 35px rgba(15,118,110,0.18)" }}
    className="p-4 rounded-2xl bg-white/85 border border-emerald-50 shadow-sm"
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-semibold">
        {step}
      </span>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    </div>
    <p>{body}</p>
  </motion.div>
);

const FeatureCard = ({ title, children }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    className="p-4 rounded-2xl bg-white/85 border border-emerald-50 shadow-sm"
  >
    <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
    <p>{children}</p>
  </motion.div>
);

export default LandingPage;
