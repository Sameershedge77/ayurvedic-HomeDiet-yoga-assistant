import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { getUser } from "../../hooks/useAuth";
import axios from "axios";

const steps = ["Profile", "Lifestyle", "Issue", "Preferences"];

export default function AssessmentPage() {
  const user = getUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const [form, setForm] = useState({
    age: "",
    gender: "",
    region: "",
    lifestyle: "",
    sleepHours: "",
    stressLevel: "",
    mainConcern: "",
    bodyArea: "",
    painSeverity: "moderate",
    issueDuration: "",
    prefers: [],
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePref = (value) => {
    setForm((p) => ({
      ...p,
      prefers: p.prefers.includes(value)
        ? p.prefers.filter((x) => x !== value)
        : [...p.prefers, value],
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      next();
      return;
    }

    setLoading(true);

    try {
      const healthIssues = [];

      if (form.bodyArea === "lower-back") healthIssues.push("back_pain");
      if (form.bodyArea === "ankle") healthIssues.push("ankle_pain");
      if (form.bodyArea === "knee") healthIssues.push("knee_pain");
      if (form.mainConcern === "cold") healthIssues.push("cold");
      if (form.mainConcern === "digestion") healthIssues.push("digestive_problems");

      const res = await axios.post(
        "http://localhost:5000/api/recommendations",
        { healthIssues }
      );

      setRecommendations(res.data.recommendations);
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-24">

        {/* ================= FORM ================= */}
        {!done && (
          <>
            <h1 className="text-4xl font-extrabold mb-2">
              Health & lifestyle check-in
            </h1>
            <p className="text-slate-600 mb-6">
              Hi <strong>{user?.name}</strong>, answer a few questions so we can give safe recommendations.
            </p>

            {/* Steps */}
            <div className="flex gap-3 mb-8">
              {steps.map((s, i) => (
                <span
                  key={s}
                  className={`px-5 py-1 rounded-full text-sm transition-all
                    ${i === step
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-emerald-100 text-emerald-700"}
                  `}
                >
                  {i + 1} {s}
                </span>
              ))}
            </div>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              {/* PROFILE */}
              {step === 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Age" name="age" value={form.age} onChange={handleChange} />
                  <Select label="Gender" name="gender" value={form.gender} onChange={handleChange}
                    options={["Male", "Female", "Other"]} />
                </div>
              )}

              {/* LIFESTYLE */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Select label="Lifestyle" name="lifestyle" value={form.lifestyle}
                    onChange={handleChange} options={["Sedentary", "Moderate", "Active"]} />
                  <Select label="Stress level" name="stressLevel" value={form.stressLevel}
                    onChange={handleChange} options={["Low", "Moderate", "High"]} />
                </div>
              )}

              {/* ISSUE */}
              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Select label="Main concern" name="mainConcern" value={form.mainConcern}
                    onChange={handleChange}
                    options={["cold", "digestion", "joint", "sleep"]} />
                  <Select label="Pain area" name="bodyArea" value={form.bodyArea}
                    onChange={handleChange}
                    options={["lower-back", "knee", "ankle", "neck"]} />
                </div>
              )}

              {/* PREFERENCES */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">What help do you prefer?</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Home remedies", "Diet changes", "Yoga", "Breathing"].map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePref(p)}
                        className={`px-5 py-2 rounded-full border transition-all
                          ${form.prefers.includes(p)
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-emerald-300 hover:bg-emerald-50"}
                        `}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border p-3"
                    placeholder="Anything we should be careful about?"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-10">
                <button type="button" onClick={prev}
                  className="px-6 py-2 rounded-full border hover:bg-emerald-50 transition">
                  Back
                </button>

                <button type="submit"
                  className="px-8 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  {step < 3 ? "Next" : loading ? "Loading..." : "Get Personalized Recommendations"}
                </button>
              </div>
            </motion.form>
          </>
        )}

        {/* ================= RESULTS ================= */}
        {done && recommendations && (
          <>
            {/* PROFILE SUMMARY */}
            <Card>
              <h3 className="font-semibold mb-4">Your Profile Summary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <Info label="Health Issue" value={form.mainConcern} />
                <Info label="Lifestyle" value={form.lifestyle} />
                <Info label="Severity" value={form.painSeverity} />
              </div>
            </Card>

            {/* YOGA */}
            <Section title="Yoga Asanas">
              {recommendations.asanas.map((a) => (
                <YogaCard key={a.name} data={a} />
              ))}
            </Section>

            {/* REMEDIES */}
            <Section title="Home Remedies">
              {recommendations.remedies.map((r) => (
                <RemedyCard key={r.name} data={r} />
              ))}
            </Section>

            {/* CERTIFICATE */}
            <Card>
              <h3 className="text-xl font-semibold mb-2">Certified Ayurvedic Guidance</h3>
              <p className="text-sm text-slate-600 mb-4">
                Recommendations reviewed & approved by certified Ayurvedic practitioners.
              </p>

              <div className="flex items-center gap-6">
                <img
                  src="/certs/cert1.jpg"
                  className="h-40 cursor-pointer hover:scale-105 transition"
                  onClick={() => window.open("/certs/cert1.jpg", "_blank")}
                />
                <div>
                  <span className="inline-block px-4 py-1 bg-emerald-100 rounded-full text-sm">
                    ✔ Verified Practitioner
                  </span>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/appointments")}
                className="px-10 py-3 rounded-full bg-emerald-600 text-white text-lg hover:bg-emerald-700 transition"
              >
                Consult Our Doctor
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <input {...props} className="w-full border rounded-xl p-2" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <select {...props} className="w-full border rounded-xl p-2">
      <option value="">Select</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const Section = ({ title, children }) => (
  <>
    <h2 className="text-2xl font-bold mt-12 mb-6">{title}</h2>
    <div className="grid md:grid-cols-3 gap-6">{children}</div>
  </>
);

const Card = ({ children }) => (
  <div className="bg-white p-6 rounded-3xl shadow mb-8">{children}</div>
);

const Info = ({ label, value }) => (
  <div className="bg-emerald-50 p-3 rounded-xl">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const YogaCard = ({ data }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-4 rounded-2xl shadow">
    <img src={`/${data.image}`} className="h-40 w-full object-cover rounded-xl" />
    <h4 className="mt-3 font-semibold">{data.name}</h4>
    <p className="text-sm">{data.benefits}</p>
    <p className="text-xs mt-1">⏱ {data.duration} min</p>
    {data.video && <a href={data.video} target="_blank" className="text-emerald-600 mt-2 inline-block">▶ Watch video</a>}
  </motion.div>
);

const RemedyCard = ({ data }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-4 rounded-2xl shadow">
    <img src={`/${data.image}`} className="h-40 w-full object-cover rounded-xl" />
    <h4 className="mt-3 font-semibold">{data.name}</h4>
    <p className="text-sm">{data.ingredients}</p>
    {data.video && <a href={data.video} target="_blank" className="text-emerald-600 mt-2 inline-block">▶ Watch video</a>}
  </motion.div>
);
