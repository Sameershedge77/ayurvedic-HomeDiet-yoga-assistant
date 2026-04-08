import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { getUser } from "../../hooks/useAuth";
import AssessmentForm from "../../components/AssessmentForm";
import Background from "../../components/ui/Background";
import GlassCard from "../../components/ui/GlassCard";
import TrustSignals from "../../components/ui/TrustSignals";
import { Activity, Leaf, Coffee, Moon, Youtube, ShieldAlert } from "lucide-react";

export default function AssessmentPage() {
  const user = getUser();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  return (
    <Background>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-24 relative z-10">
        {!results ? (
          /* --- ASSESSMENT STATE --- */
          <div className="space-y-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-emerald-900 mb-2">
                Holistic Health Assessment
              </h1>
              <p className="text-emerald-700">
                Hi <strong>{user?.name}</strong>, let's create your personalized Ayurvedic profile.
              </p>
            </div>

            <AssessmentForm onComplete={setResults} />
          </div>
        ) : (
          /* --- RESULT STATE --- */
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-emerald-900">Your Ayurvedic Plan</h1>
              <p className="text-emerald-600 mt-2 max-w-2xl mx-auto">
                {results.summary}
              </p>
            </div>

            {/* DOSHA ANALYSIS */}
            {results.dosha_analysis && (
              <GlassCard className="border-l-4 border-l-emerald-500">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-emerald-800">
                  <Activity size={24} /> Dosha Analysis
                </h3>
                <p className="text-slate-700">{results.dosha_analysis}</p>
              </GlassCard>
            )}

            {/* YOGA SECTION */}
            {(results.recommendations?.yoga?.length > 0 || results.yoga?.length > 0) && (
              <>
                <SectionHeader title="Recommended Yoga Asanas" icon={<Activity />} />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(results.recommendations?.yoga || results.yoga)?.map((asana, i) => (
                    <ExpandableCard key={i} item={asana} type="yoga" />
                  ))}
                </div>

                {/* EXERCISE GUIDANCE (Moved here) */}
                {results.recommendations?.exercise_do && (
                  <div className="mt-8">
                    <SectionHeader title="Exercise Guidance" icon={<Activity />} />
                    <div className="grid md:grid-cols-2 gap-6">
                      <GlassCard className="border-t-2 border-teal-500">
                        <h4 className="font-bold text-teal-800 mb-2">Recommended Exercise</h4>
                        <p className="text-sm text-slate-700">{results.recommendations.exercise_do}</p>
                      </GlassCard>
                      <GlassCard className="border-t-2 border-orange-400">
                        <h4 className="font-bold text-orange-800 mb-2">Exercise Restrictions</h4>
                        <p className="text-sm text-slate-700">{results.recommendations.exercise_dont}</p>
                      </GlassCard>
                    </div>
                  </div>
                )}

                {/* AYURVEDIC SUPPORT (Moved here) */}
                {results.recommendations?.ayurvedic_support && (
                  <div className="mt-8">
                    <SectionHeader title="Ayurvedic Support & Timing" icon={<Leaf />} />
                    <GlassCard className="border-l-4 border-emerald-600">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-emerald-800 text-sm uppercase tracking-wider mb-1">Recommended Support</h4>
                          <p className="text-slate-700">{results.recommendations.ayurvedic_support}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-800 text-sm uppercase tracking-wider mb-1">Timing & Dosage</h4>
                          <p className="text-slate-700">{results.recommendations.support_timing}</p>
                        </div>
                        {results.recommendations.frequency_plan && (
                          <div className="p-3 bg-emerald-50 rounded-lg">
                            <h4 className="font-bold text-emerald-900 text-xs uppercase mb-1">Frequency Plan</h4>
                            <p className="text-emerald-800 text-sm">{results.recommendations.frequency_plan}</p>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                )}
              </>
            )}

            {/* REMEDIES SECTION */}
            {(results.recommendations?.ayurveda?.length > 0 || results.recommendations?.remedies?.length > 0 || results.ayurveda?.length > 0 || results.remedies?.length > 0) && (
              <>
                <SectionHeader title="Herbal Remedies & Therapies" icon={<Leaf />} />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(results.recommendations?.ayurveda || results.recommendations?.remedies || results.ayurveda || results.remedies)?.map((rem, i) => (
                    <ExpandableCard key={i} item={rem} type="remedy" />
                  ))}
                </div>
              </>
            )}

            {/* DIET SECTION */}
            <SectionHeader title="Dietary Guidelines" icon={<Coffee />} />
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="border-t-2 border-emerald-500">
                <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Do (Include)
                </h4>
                <ul className="space-y-3">
                  {results.recommendations?.diet_do ? (
                    <li className="text-sm text-slate-700">{results.recommendations.diet_do}</li>
                  ) : (
                    (results.recommendations?.diet_tips || results.diet_tips)?.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        {tip}
                      </li>
                    ))
                  )}
                </ul>
              </GlassCard>

              {results.recommendations?.diet_dont && (
                <GlassCard className="border-t-2 border-red-400">
                  <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Don't (Avoid)
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-sm text-slate-700">{results.recommendations.diet_dont}</li>
                  </ul>
                </GlassCard>
              )}
            </div>

            {/* LIFESTYLE SECTION */}
            <SectionHeader title="Lifestyle Edits" icon={<Moon />} />
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="border-t-2 border-blue-500">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Do (Include)
                </h4>
                <ul className="space-y-3">
                  {results.recommendations?.lifestyle_do ? (
                    <li className="text-sm text-slate-700">{results.recommendations.lifestyle_do}</li>
                  ) : (
                    (results.recommendations?.lifestyle_tips || results.lifestyle_tips)?.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        {tip}
                      </li>
                    ))
                  )}
                </ul>
              </GlassCard>

              {results.recommendations?.lifestyle_dont && (
                <GlassCard className="border-t-2 border-amber-500">
                  <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Don't (Avoid)
                  </h4>
                  <ul className="space-y-3">
                    <li className="text-sm text-slate-700">{results.recommendations.lifestyle_dont}</li>
                  </ul>
                </GlassCard>
              )}
            </div>

            {/* SECONDARY CONSTRAINTS */}

            {/* SECONDARY CONSTRAINTS */}
            {results.recommendations?.secondary_constraints && (
              <GlassCard className="bg-amber-50/50 border-amber-200">
                <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Activity size={18} /> Secondary Dosha Considerations
                </h4>
                <p className="text-amber-800 text-sm italic">{results.recommendations.secondary_constraints}</p>
              </GlassCard>
            )}

            {/* SAFETY WARNING */}
            <div className="bg-red-50 border border-red-100 p-6 rounded-3xl mt-12">
              <h3 className="text-red-800 font-bold flex items-center gap-2 mb-2">
                <ShieldAlert size={20} /> Mandatory Safety Disclosure
              </h3>
              <p className="text-sm text-red-700 leading-relaxed">
                {results.safety_warning || "Ayurvedic recommendations are for educational purposes only. Consult a qualified Ayurveda practitioner before taking medicines or making major health changes."}
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-8 pb-12">
              <button
                onClick={() => navigate("/appointments")}
                className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition"
              >
                Consult an Ayurvedic Expert
              </button>
            </div>

            {/* TRUST SIGNALS */}
            <TrustSignals />
          </div>
        )}
      </main>
    </Background>
  );
}

// NOTE: Make sure your images are in public/images/asanas/filename.jpg
const getYogaImage = (keyword) => {
  if (!keyword) return "/images/yoga-placeholder.jpg";
  // If keyword already has extension, use it, otherwise add .jpg
  const fileName = keyword.includes('.') ? keyword : `${keyword}.jpg`;
  return `/images/asanas/${fileName}`;
};

const getRemedyImage = (keyword) => {
  if (!keyword) return "/images/remedy-placeholder.jpg";
  const fileName = keyword.includes('.') ? keyword : `${keyword}.jpg`;
  return `/images/remedies/${fileName}`;
};

const ExpandableCard = ({ item, type }) => {
  const [expanded, setExpanded] = useState(false);

  // Determine image source
  const imgSrc = type === "yoga"
    ? getYogaImage(item.image_keyword)
    : getRemedyImage(item.image_keyword);

  return (
    <GlassCard className="transition-all duration-300">
      <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-emerald-50 group">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Ayurveda"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg shadow-black drop-shadow-md">
          {item.name}
        </h4>
      </div>

      <p className="text-sm text-slate-600 mb-3">{item.benefits}</p>

      {type === "yoga" && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">
            {item.reps_sets || item.duration || "5-10 MINS"}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
          >
            {expanded ? "Hide Steps" : "How to do?"}
          </button>
          {item.video && (
            <a
              href={item.video}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 flex items-center gap-1"
            >
              <Youtube size={12} /> Video
            </a>
          )}
        </div>
      )}

      {/* EXPANDABLE CONTENT */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-emerald-100 mt-2 space-y-3">
              <div>
                <h5 className="font-black text-[10px] uppercase tracking-widest text-emerald-800 mb-1">Detailed Steps:</h5>
                <ol className="list-decimal list-inside space-y-1.5">
                  {item.steps?.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-600 leading-relaxed pl-1 font-medium">
                      {step}
                    </li>
                  )) || <p className="text-xs text-slate-500">Follow standard instructions.</p>}
                </ol>
              </div>

              {type === "remedy" && (
                <div className="pl-3 border-l-2 border-teal-500 bg-teal-50/20 p-2.5 rounded-r-xl">
                  <h5 className="font-black text-[9px] uppercase tracking-widest text-teal-800 mb-1">Dosage & Frequency</h5>
                  <p className="text-[11px] text-teal-900 font-bold italic leading-tight">
                    {item.frequency || item.dosage_timing || item.usage?.split('.')[0] || "Consult practitioner."}
                  </p>
                  {item.preparation_time && (
                    <p className="text-[9px] text-teal-700 mt-1 font-medium">Prep: {item.preparation_time}</p>
                  )}
                </div>
              )}

              {item.contraindications && item.contraindications.toLowerCase() !== "none" && (
                <p className="text-[10px] text-red-600 mt-2 font-bold bg-red-50 p-2 rounded-lg border border-red-100 flex items-start gap-1.5">
                  <span className="uppercase text-[8px] mt-0.5 px-1 bg-red-100 rounded">Safety</span> Avoid if: {item.contraindications}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {type === "remedy" && (
        <>
          <div className="mt-2 text-sm text-slate-700 border-t pt-2 border-emerald-50">
            <strong className="text-emerald-800">Usage:</strong> {item.usage}
          </div>
          {item.video && (
            <a
              href={item.video}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800"
            >
              <Youtube size={12} /> Watch Video Guide
            </a>
          )}
        </>
      )}
    </GlassCard>
  );
};

/* --- INSIDE THE MAIN COMPONENT RENDER --- */
// Replace the old map loops with:
/*
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {results.yoga?.map((asana, i) => (
        <ExpandableCard key={i} item={asana} type="yoga" />
    ))}
</div>
*/

/* --- SECTION HEADERS HELPER --- */
const SectionHeader = ({ title, icon }) => (
  <h2 className="text-2xl font-bold text-emerald-900 mt-10 mb-6 flex items-center gap-3">
    <span className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shadow-sm">{icon}</span>
    {title}
  </h2>
);
